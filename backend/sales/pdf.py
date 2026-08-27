from io import BytesIO
from decimal import Decimal

from django.conf import settings
from django.db.models import Prefetch

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from num2words import num2words

from company.models import Company

# ============================================================
# FONTS
# ============================================================

FONT_PATH = (
    settings.BASE_DIR
    / "static"
    / "fonts"
    / "DejaVuSans.ttf"
)

FONT_BOLD_PATH = (
    settings.BASE_DIR
    / "static"
    / "fonts"
    / "DejaVuSans-Bold.ttf"
)

pdfmetrics.registerFont(
    TTFont(
        "DejaVuSans",
        str(FONT_PATH),
    )
)

pdfmetrics.registerFont(
    TTFont(
        "DejaVuSans-Bold",
        str(FONT_BOLD_PATH),
    )
)
# ============================================================
# COLORS
# ============================================================

ORANGE = HexColor("#F4510B")
DARK = HexColor("#20262B")
GRAY = HexColor("#666666")
LIGHT_GRAY = HexColor("#D9D9D9")
VERY_LIGHT_GRAY = HexColor("#F7F7F7")
WHITE = colors.white
BLACK = colors.black


# ============================================================
# HELPERS
# ============================================================

def money(value):
    """
    Format Decimal / float into Indian-style invoice amount.
    """
    if value is None:
        value = Decimal("0")

    return f"{Decimal(str(value)):,.2f}"


def safe_text(value):
    """
    Prevent None from appearing in PDF.
    """
    if value is None:
        return ""

    return str(value)


def draw_right_text(p, text, x, y, font="Helvetica", size=9):
    p.setFont(font, size)
    p.drawRightString(x, y, safe_text(text))


def draw_label_value(
    p,
    label,
    value,
    x,
    y,
    label_width=65,
    font_size=8.5,
):
    p.setFont("Helvetica", font_size)
    p.setFillColor(BLACK)

    p.drawString(x, y, label)

    p.setFillColor(GRAY)
    p.drawString(x + label_width, y, ":")

    p.setFillColor(BLACK)
    p.drawString(
        x + label_width + 12,
        y,
        safe_text(value),
    )


def draw_section_label(
    p,
    text,
    x,
    y,
    width=125,
):
    """
    Orange angled-looking section header.
    """

    p.setFillColor(ORANGE)

    p.rect(
        x,
        y - 3,
        width,
        22,
        fill=1,
        stroke=0,
    )

    # Small white triangle at right
    p.setFillColor(WHITE)

    p.saveState()

    p.setFillColor(ORANGE)

    p.translate(x + width, y - 3)

    p.setFillColor(ORANGE)

    p.beginPath()
    path = p.beginPath()
    path.moveTo(0, 0)
    path.lineTo(15, 19)
    path.lineTo(0, 19)
    path.close()

    p.drawPath(path, fill=1, stroke=0)

    p.restoreState()

    p.setFillColor(WHITE)
    p.setFont("Helvetica-Bold", 9)

    p.drawString(
        x + 10,
        y + 4,
        text.upper(),
    )


def draw_box(
    p,
    x,
    y,
    width,
    height,
):
    p.setFillColor(WHITE)
    p.setStrokeColor(LIGHT_GRAY)

    p.roundRect(
        x,
        y,
        width,
        height,
        8,
        fill=1,
        stroke=1,
    )


def get_product_field(product, *field_names):
    """
    Tries multiple possible product field names.
    This keeps the invoice compatible with the current
    product model.
    """

    for field in field_names:
        value = getattr(product, field, None)

        if value not in [None, ""]:
            return value

    return ""

# ============================================================
# FONTS
# ============================================================

FONT_PATH = (
    settings.BASE_DIR
    / "static"
    / "fonts"
    / "DejaVuSans.ttf"
)

FONT_BOLD_PATH = (
    settings.BASE_DIR
    / "static"
    / "fonts"
    / "DejaVuSans-Bold.ttf"
)

pdfmetrics.registerFont(
    TTFont("DejaVuSans", str(FONT_PATH))
)

pdfmetrics.registerFont(
    TTFont("DejaVuSans-Bold", str(FONT_BOLD_PATH))
)
# ============================================================
# MAIN INVOICE
# ============================================================

def generate_invoice(sale):

    company = Company.objects.first()

    buffer = BytesIO()

    page_width, page_height = A4

    p = canvas.Canvas(
        buffer,
        pagesize=A4,
    )

    # ========================================================
    # COMPANY DATA
    # ========================================================

    company_name = (
        getattr(company, "name", "")
        if company
        else "FARENI"
    )

    company_phone = (
        getattr(company, "phone", "")
        if company
        else ""
    )

    company_email = (
        getattr(company, "email", "")
        if company
        else ""
    )

    company_address = (
        getattr(company, "address", "")
        if company
        else ""
    )

    company_gst = (
        getattr(company, "gst_number", "")
        if company
        else ""
    )

    # ========================================================
    # LOGO
    # ========================================================

    logo_path = (
        settings.BASE_DIR
        / "static"
        / "images"
        / "fareni_logo.jpeg"
    )

    try:
        from PIL import Image, ImageChops, ImageEnhance

        logo = Image.open(
            str(logo_path)
        ).convert("RGB")

        # ----------------------------------------------------
        # REMOVE WHITE / EMPTY SPACE AROUND LOGO
        # ----------------------------------------------------

        background = Image.new(
            "RGB",
            logo.size,
            (255, 255, 255)
        )

        diff = ImageChops.difference(
            logo,
            background
        )

        # Increase contrast to remove JPEG white noise
        diff = ImageEnhance.Contrast(diff).enhance(3)

        # Convert to grayscale
        diff_gray = diff.convert("L")

        # Remove very small differences
        diff_gray = diff_gray.point(
            lambda pixel: 255 if pixel > 20 else 0
        )

        bbox = diff_gray.getbbox()

        if bbox:
            logo = logo.crop(bbox)

        # ----------------------------------------------------
        # ADD SMALL INTERNAL PADDING
        # ----------------------------------------------------

        padding = 8

        padded_logo = Image.new(
            "RGB",
            (
                logo.width + padding * 2,
                logo.height + padding * 2
            ),
            "white"
        )

        padded_logo.paste(
            logo,
            (padding, padding)
        )

        logo = padded_logo

        # ----------------------------------------------------
        # SAVE CROPPED LOGO
        # ----------------------------------------------------

        cropped_logo_path = (
            settings.BASE_DIR
            / "static"
            / "images"
            / "fareni_logo_cropped.jpeg"
        )

        logo.save(
            str(cropped_logo_path),
            "JPEG",
            quality=100
        )

        # ----------------------------------------------------
        # DRAW LOGO
        # ----------------------------------------------------

        p.drawImage(
            ImageReader(
                str(cropped_logo_path)
            ),

            # ------------------------------------------------
            # POSITION
            # Slightly more padding from top
            # Slightly shifted to the right
            # ------------------------------------------------

            45,                       # LEFT / RIGHT POSITION
            page_height - 140,        # TOP PADDING

            # ------------------------------------------------
            # LOGO SIZE — KEEP SAME
            # ------------------------------------------------

            width=240,
            height=125,

            preserveAspectRatio=False,
            anchor="sw",
            mask="auto",
        )

    except Exception as e:

        print("Logo error:", e)

        # ----------------------------------------------------
        # FALLBACK
        # ----------------------------------------------------

        p.setFillColor(DARK)

        p.setFont(
            "Helvetica-Bold",
            30
        )

        p.drawString(
            55,
            page_height - 70,
            "FARENI"
        )

        p.setFillColor(ORANGE)

        p.setFont(
            "Helvetica-Bold",
            9
        )

        p.drawString(
            57,
            page_height - 87,
            "FASTENING SYSTEMS"
        )

    # ========================================================
    # INVOICE TITLE
    # ========================================================

    p.setFillColor(ORANGE)

    p.setFont(
        "Helvetica-Bold",
        28,
    )

    p.drawRightString(
        page_width - 102,
        page_height - 70,
        "INVOICE",
    )

    # Vertical separator

    p.setStrokeColor(DARK)

    p.setLineWidth(0.8)

    p.line(
        page_width - 230,
        page_height - 42,
        page_width - 230,
        page_height - 135,
    )

    # ========================================================
    # INVOICE DETAILS
    # ========================================================

    details_x = page_width - 215

    invoice_y = page_height - 94

    draw_label_value(
        p,
        "Invoice No.",
        sale.sale_number,
        details_x,
        invoice_y,
    )

    draw_label_value(
        p,
        "Date",
        sale.sale_date,
        details_x,
        invoice_y - 19,
    )

    draw_label_value(
        p,
        "GSTIN",
        company_gst,
        details_x,
        invoice_y - 38,
    )

    # ========================================================
    # HEADER SEPARATOR
    # ========================================================

    p.setStrokeColor(ORANGE)
    p.setLineWidth(3)

    p.line(
        42,
        page_height - 152,
        page_width - 42,
        page_height - 152,
    )

    p.setStrokeColor(DARK)
    p.setLineWidth(0.8)

    p.line(
        42,
        page_height - 160,
        page_width - 42,
        page_height - 160,
    )

    # ========================================================
    # CUSTOMER
    # ========================================================

    customer = sale.customer

    customer_name = safe_text(
        getattr(customer, "name", "")
    )

    customer_company = safe_text(
        getattr(customer, "company_name", "")
    )

    customer_phone = safe_text(
        getattr(customer, "phone", "")
    )

    customer_address = safe_text(
        getattr(customer, "address", "")
    )

    customer_city = safe_text(
        getattr(customer, "city", "")
    )

    customer_state = safe_text(
        getattr(customer, "state", "")
    )

    customer_pincode = safe_text(
        getattr(customer, "pincode", "")
    )

    customer_gst = safe_text(
        getattr(customer, "gst_number", "")
    )


    # ========================================================
    # BILL TO / SHIP TO POSITIONS
    # ========================================================

    # Main boxes
    box_y = page_height - 285

    left_x = 42
    right_x = 310

    box_width = 243
    box_height = 92


    # ========================================================
    # SECTION LABELS
    # ========================================================

    draw_section_label(
        p,
        "Bill To:",
        left_x,
        box_y + box_height - 2,
        82,
    )

    draw_section_label(
        p,
        "Ship To:",
        right_x,
        box_y + box_height - 2,
        82,
    )


    # ========================================================
    # BOXES
    # ========================================================

    draw_box(
        p,
        left_x,
        box_y,
        box_width,
        box_height,
    )

    draw_box(
        p,
        right_x,
        box_y,
        box_width,
        box_height,
    )


    # ========================================================
    # CITY / STATE / PINCODE
    # ========================================================

    city_state_parts = []

    if customer_city:
        city_state_parts.append(customer_city)

    if customer_state:
        city_state_parts.append(customer_state)

    city_state = ", ".join(city_state_parts)

    if customer_pincode:

        if city_state:
            city_state = (
                f"{city_state} - "
                f"{customer_pincode}"
            )
        else:
            city_state = customer_pincode


    # ========================================================
    # BILL TO CONTENT
    # ========================================================

    content_x = left_x + 12
    content_y = box_y + box_height - 15


    # Customer Name
    p.setFillColor(BLACK)
    p.setFont(
        "Helvetica-Bold",
        9,
    )

    p.drawString(
        content_x,
        content_y,
        customer_name,
    )


    # Phone
    if customer_phone:

        draw_right_text(
            p,
            f"Ph: {customer_phone}",
            left_x + box_width - 12,
            content_y,
            "Helvetica",
            8,
        )


    # Company
    if customer_company:

        p.setFillColor(DARK)
        p.setFont(
            "Helvetica",
            8,
        )

        p.drawString(
            content_x,
            content_y - 17,
            customer_company,
        )


    # Address
    if customer_address:

        p.setFillColor(DARK)
        p.setFont(
            "Helvetica",
            8,
        )

        p.drawString(
            content_x,
            content_y - 34,
            customer_address[:55],
        )


    # City / State / Pincode
    if city_state:

        p.drawString(
            content_x,
            content_y - 51,
            city_state,
        )


    # GST
    if customer_gst:

        p.setFillColor(DARK)

        p.drawString(
            content_x,
            content_y - 68,
            f"GSTIN: {customer_gst}",
        )


    # ========================================================
    # SHIP TO CONTENT
    # ========================================================

    content_x = right_x + 12
    content_y = box_y + box_height - 15


    # Customer Name
    p.setFillColor(BLACK)

    p.setFont(
        "Helvetica-Bold",
        9,
    )

    p.drawString(
        content_x,
        content_y,
        customer_name,
    )


    # Phone
    if customer_phone:

        draw_right_text(
            p,
            f"Ph: {customer_phone}",
            right_x + box_width - 12,
            content_y,
            "Helvetica",
            8,
        )


    # Company
    if customer_company:

        p.setFillColor(DARK)

        p.setFont(
            "Helvetica",
            8,
        )

        p.drawString(
            content_x,
            content_y - 17,
            customer_company,
        )


    # Address
    if customer_address:

        p.drawString(
            content_x,
            content_y - 34,
            customer_address[:55],
        )


    # City / State / Pincode
    if city_state:

        p.drawString(
            content_x,
            content_y - 51,
            city_state,
        )


    # GST
    if customer_gst:

        p.drawString(
            content_x,
            content_y - 68,
            f"GSTIN: {customer_gst}",
        )


    # ========================================================
    # RESET COLORS
    # ========================================================

    p.setFillColor(BLACK)
    p.setStrokeColor(BLACK)



    # ========================================================
    # ITEMS TABLE
    # ========================================================

    table_x = 42
    table_y = box_y - 40

    table_width = page_width - 84

    header_height = 24
    row_height = 24

    columns = [
        ("SR.", 35),
        ("DESCRIPTION", 160),
        ("SIZE", 70),
        ("GRADE", 50),
        ("QTY.", 50),
        ("RATE (₹)", 75),
        ("AMOUNT (₹)", 71),
    ]


    # ========================================================
    # HEADER
    # ========================================================

    p.setFillColor(ORANGE)
    p.setStrokeColor(DARK)
    p.setLineWidth(0.5)
    p.rect(
        table_x,
        table_y,
        table_width,
        header_height,
        fill=1,
        stroke=1,
    )


    # ========================================================
    # HEADER COLUMN SEPARATOR LINES
    # ========================================================

    p.setStrokeColor(DARK)
    p.setLineWidth(0.5)

    current_x = table_x

    for _, width in columns[:-1]:

        current_x += width

        p.line(
            current_x,
            table_y,
            current_x,
            table_y + header_height,
        )


    # ========================================================
    # HEADER TEXT
    # ========================================================

    p.setFillColor(WHITE)

    p.setFont(
        "DejaVuSans-Bold",
        7,
    )

    current_x = table_x

    for title, width in columns:

        p.drawCentredString(
            current_x + width / 2,
            table_y + 8,
            title,
        )

        current_x += width


    # ========================================================
    # ITEM ROWS
    # ========================================================

    current_y = table_y - row_height

    items = sale.items.all()

    for index, item in enumerate(items, start=1):

        product = item.product

        description = get_product_field(
            product,
            "name",
            "product_name",
        )

        product_size = getattr(
            product,
            "product_size",
            None,
        )

        size = ""

        if product_size:
            size = safe_text(
                getattr(
                    product_size,
                    "name",
                    "",
                )
            )

        # Fallback to old size field if required
        if not size:
            size = get_product_field(
                product,
                "size",
                "dimension",
                "variant",
            )

        grade = get_product_field(
            product,
            "grade",
        )
        quantity = item.quantity

        rate = item.selling_price

        line_total = item.line_total


        # ====================================================
        # ROW BACKGROUND
        # ====================================================

        p.setFillColor(WHITE)

        p.rect(
            table_x,
            current_y,
            table_width,
            row_height,
            fill=1,
            stroke=0,
        )


        # ====================================================
        # ROW BORDER
        # ====================================================

        p.setStrokeColor(DARK)
        p.setLineWidth(0.5)

        p.rect(
            table_x,
            current_y,
            table_width,
            row_height,
            fill=0,
            stroke=1,
        )


        # ====================================================
        # VERTICAL COLUMN SEPARATOR LINES
        # ====================================================

        p.setStrokeColor(DARK)
        p.setLineWidth(0.5)

        current_x = table_x

        for _, width in columns[:-1]:

            current_x += width

            p.line(
                current_x,
                current_y,
                current_x,
                current_y + row_height,
            )


        # ====================================================
        # ITEM TEXT
        # ====================================================

        p.setFillColor(BLACK)

        p.setFont(
            "Helvetica",
            7.5,
        )

        values = [
            index,
            description,
            size or "-",
            grade or "-",
            quantity,
            money(rate),
            money(line_total),
        ]

        current_x = table_x

        for (_, width), value in zip(
            columns,
            values,
        ):

            text = safe_text(value)

            # Amount / numeric columns right aligned
            if (
                isinstance(value, (int, float, Decimal))
                or current_x > table_x + 500
            ):

                p.drawRightString(
                    current_x + width - 6,
                    current_y + 8,
                    text,
                )

            else:

                p.drawCentredString(
                    current_x + width / 2,
                    current_y + 8,
                    text,
                )

            current_x += width


        # ====================================================
        # NEXT ROW
        # ====================================================

        current_y -= row_height


        # ====================================================
        # AVOID OVERFLOWING THE PAGE
        # ====================================================

        if current_y < 300:
            break


    # ========================================================
    # RESET COLORS
    # ========================================================

    p.setFillColor(BLACK)
    p.setStrokeColor(BLACK)

    # ========================================================
    # TOTALS
    # ========================================================

    subtotal = getattr(
        sale,
        "subtotal",
        Decimal("0"),
    )

    discount = getattr(
        sale,
        "discount",
        Decimal("0"),
    )

    if discount is None:
        discount = Decimal("0")


    # Support alternate discount field
    if discount == 0:

        discount = getattr(
            sale,
            "discount_amount",
            Decimal("0"),
        )

    # ========================================================
    # GST
    # ========================================================

    gst_amount = getattr(
        sale,
        "gst_amount",
        Decimal("0"),
    )

    if gst_amount is None:
        gst_amount = Decimal("0")

    # Split GST equally into CGST and SGST
    cgst = gst_amount / Decimal("2")
    sgst = gst_amount / Decimal("2")
    


    grand_total = getattr(
        sale,
        "grand_total",
        Decimal("0"),
    )


    # ========================================================
    # TOTALS POSITION
    # ========================================================

    totals_x = 330
    totals_width = 228

    totals_y = current_y - 10

    row_h = 27

    # Label / Amount separator position
    separator_x = totals_x + 125


    # ========================================================
    # TOTAL ROWS
    # ========================================================

    gst_percent = Decimal("0")

    items = sale.items.all()

    if items.exists():
        gst_percent = sum(
            Decimal(str(item.gst or 0))
            for item in items
        ) / Decimal(str(items.count()))

    cgst_percent = gst_percent / Decimal("2")
    sgst_percent = gst_percent / Decimal("2")


    totals_rows = [
        ("SUB TOTAL", subtotal),
        ("DISCOUNT", discount),
        (
            f"CGST ({cgst_percent:g}%)",
            cgst,
        ),
        (
            f"SGST ({sgst_percent:g}%)",
            sgst,
        ),
    ]


    for label, value in totals_rows:

        # ----------------------------------------------------
        # Row background
        # ----------------------------------------------------

        p.setFillColor(WHITE)

        p.setStrokeColor(DARK)
        p.setLineWidth(0.5)

        p.rect(
            totals_x,
            totals_y,
            totals_width,
            row_h,
            fill=1,
            stroke=1,
        )


        # ----------------------------------------------------
        # Vertical separator
        # ----------------------------------------------------

        p.setStrokeColor(DARK)
        p.setLineWidth(0.5)

        p.line(
            separator_x,
            totals_y,
            separator_x,
            totals_y + row_h,
        )


        # ----------------------------------------------------
        # Label
        # ----------------------------------------------------

        p.setFillColor(DARK)

        p.setFont(
            "DejaVuSans-Bold",
            8,
        )

        p.drawString(
            totals_x + 12,
            totals_y + 9,
            label,
        )


        # ----------------------------------------------------
        # Amount
        # ----------------------------------------------------

        p.drawRightString(
            totals_x + totals_width - 12,
            totals_y + 9,
            f"₹ {money(value)}",
        )


        totals_y -= row_h


    # ========================================================
    # GRAND TOTAL
    # ========================================================

    p.setFillColor(ORANGE)

    p.setStrokeColor(DARK)
    p.setLineWidth(0.5)

    p.rect(
        totals_x,
        totals_y,
        totals_width,
        row_h,
        fill=1,
        stroke=1,
    )


    # ========================================================
    # GRAND TOTAL VERTICAL SEPARATOR
    # ========================================================

    p.setStrokeColor(DARK)
    p.setLineWidth(0.5)

    p.line(
        separator_x,
        totals_y,
        separator_x,
        totals_y + row_h,
    )


    # ========================================================
    # GRAND TOTAL TEXT
    # ========================================================

    p.setFillColor(WHITE)

    p.setFont(
        "DejaVuSans-Bold",
        9,
    )

    p.drawString(
        totals_x + 12,
        totals_y + 9,
        "GRAND TOTAL",
    )

    p.drawRightString(
        totals_x + totals_width - 12,
        totals_y + 9,
        f"₹ {money(grand_total)}",
    )

    # ========================================================
    # AMOUNT IN WORDS
    # ========================================================

    words_y = totals_y - 55

    try:

        amount_words = num2words(
            grand_total,
            lang="en_IN",
        )

    except Exception:

        amount_words = num2words(
            grand_total,
            lang="en",
        )

    p.setFillColor(BLACK)

    p.setFont(
        "Helvetica-Bold",
        8,
    )

    p.drawString(
        42,
        words_y,
        "Amount in Words:",
    )

    p.setFont(
        "Helvetica",
        8,
    )

    p.drawString(
        42,
        words_y - 17,
        amount_words.title()
        + " Rupees Only",
    )

    # ========================================================
    # TERMS & CONDITIONS
    # ========================================================

    bottom_y = 135

    draw_section_label(
        p,
        "Terms & Conditions:",
        42,
        bottom_y + 55,
        145,
    )

    terms = [
        "Goods once sold will not be taken back or exchanged.",
        "Payment to be made within agreed credit period.",
        "Interest @ 18% p.a. will be charged on delayed payments.",
        "Subject to Pune, Maharashtra jurisdiction only.",
        "Thank you for your business!",
    ]

    p.setFillColor(DARK)

    p.setFont(
        "Helvetica",
        6.8,
    )

    term_y = bottom_y + 39

    for term in terms:

        p.drawString(
            47,
            term_y,
            "•",
        )

        p.drawString(
            57,
            term_y,
            term,
        )

        term_y -= 10

    # ========================================================
    # BANK DETAILS
    # ========================================================

    draw_section_label(
        p,
        "Bank Details:",
        245,
        bottom_y + 55,
        110,
    )

    bank_x = 245

    bank_y = bottom_y + 39

    bank_details = [
        (
            "Bank Name",
            "HDFC Bank Ltd.",
        ),
        (
            "A/c Name",
            "Fareni Fastening Systems",
        ),
        (
            "A/c No.",
            "50200012345678",
        ),
        (
            "IFSC Code",
            "HDFC0001234",
        ),
        (
            "Branch",
            "Pune, Maharashtra",
        ),
    ]

    p.setFillColor(DARK)

    p.setFont(
        "Helvetica",
        6.8,
    )

    for label, value in bank_details:

        p.drawString(
            bank_x,
            bank_y,
            label,
        )

        p.drawString(
            bank_x + 55,
            bank_y,
            ":",
        )

        p.drawString(
            bank_x + 65,
            bank_y,
            value,
        )

        bank_y -= 10

    # ========================================================
    # AUTHORIZED SIGNATORY
    # ========================================================

    signature_x = 405

    signature_y = bottom_y + 10

    p.setStrokeColor(DARK)

    p.setLineWidth(0.6)

    p.line(
        signature_x,
        signature_y + 32,
        page_width - 42,
        signature_y + 32,
    )

    p.setFillColor(DARK)

    p.setFont(
        "Helvetica",
        7,
    )

    p.drawCentredString(
        478,
        signature_y + 19,
        "Authorized Signatory",
    )

    p.setFont(
        "Helvetica-Bold",
        7,
    )

    p.drawCentredString(
        478,
        signature_y + 5,
        "For FARENI FASTENING SYSTEMS",
    )

    p.setFillColor(ORANGE)

    p.setFont("Helvetica-Bold",8,)
    
    p.drawCentredString(
        503,
        signature_y-5,
        "MEET MAKWANA",
    )

    p.setFillColor(DARK)
    p.setFont("Helvetica",7,)
    p.drawCentredString(
        508,
        signature_y-13,
        "Managing Director"
    )

    # ========================================================
    # FOOTER
    # ========================================================

    footer_height = 65

    p.setFillColor(DARK)

    p.rect(
        0,
        0,
        page_width,
        footer_height,
        fill=1,
        stroke=0,
    )

    # Orange right corner

    p.setFillColor(ORANGE)

    footer_path = p.beginPath()

    footer_path.moveTo(
        page_width - 75,
        0,
    )

    footer_path.lineTo(
        page_width,
        0,
    )

    footer_path.lineTo(
        page_width,
        footer_height,
    )

    footer_path.lineTo(
        page_width - 25,
        footer_height,
    )

    footer_path.close()

    p.drawPath(
        footer_path,
        fill=1,
        stroke=0,
    )

    # ========================================================
    # FOOTER FEATURES
    # ========================================================

    feature_positions = [
        65,
        145,
        225,
        305,
    ]

    feature_titles = [
        ("QUALITY", "ASSURED"),
        ("RELIABLE", "SUPPLY"),
        ("GLOBAL", "SOURCING"),
        ("ON TIME", "DELIVERY"),
    ]

    for index, x in enumerate(
        feature_positions
    ):

        # Separator
        if index > 0:

            p.setStrokeColor(
                HexColor("#555B60")
            )

            p.line(
                x - 35,
                13,
                x - 35,
                52,
            )

        # Orange circle/icon placeholder
        p.setStrokeColor(ORANGE)

        p.setLineWidth(1.2)

        p.circle(
            x,
            42,
            8,
            fill=0,
            stroke=1,
        )

        p.setFillColor(WHITE)

        p.setFont(
            "Helvetica-Bold",
            5.5,
        )

        p.drawCentredString(
            x,
            22,
            feature_titles[index][0],
        )

        p.drawCentredString(
            x,
            14,
            feature_titles[index][1],
        )

    # ========================================================
    # FOOTER MESSAGE
    # ========================================================

    p.setFillColor(WHITE)

    p.setFont(
        "Helvetica",
        11,
    )

    p.drawString(
        350,
        34,
        "QUALITY FASTENERS.",
    )

    p.setFillColor(ORANGE)

    p.setFont(
        "Helvetica-Bold",
        12,
    )

    p.drawString(
        350,
        18,
        "STRONGER CONNECTIONS.",
    )

    # ========================================================
    # SAVE
    # ========================================================

    p.save()

    pdf = buffer.getvalue()

    buffer.close()

    return pdf