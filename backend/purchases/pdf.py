# purchases/pdf.py

from io import BytesIO
from decimal import Decimal

from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
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
WHITE = colors.white
BLACK = colors.black


# ============================================================
# HELPERS
# ============================================================

def money(value):
    if value is None:
        value = Decimal("0")

    return f"{Decimal(str(value)):,.2f}"


def safe_text(value):
    if value is None:
        return ""

    return str(value)


def draw_right_text(
    p,
    text,
    x,
    y,
    font="Helvetica",
    size=9,
):
    p.setFont(font, size)
    p.drawRightString(
        x,
        y,
        safe_text(text),
    )


def draw_label_value(
    p,
    label,
    value,
    x,
    y,
    label_width=65,
    font_size=8.5,
):
    p.setFont(
        "Helvetica",
        font_size,
    )

    p.setFillColor(BLACK)

    p.drawString(
        x,
        y,
        label,
    )

    p.setFillColor(GRAY)

    p.drawString(
        x + label_width,
        y,
        ":",
    )

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
    p.setFillColor(ORANGE)

    p.rect(
        x,
        y - 3,
        width,
        22,
        fill=1,
        stroke=0,
    )

    p.saveState()

    path = p.beginPath()

    path.moveTo(
        width,
        y - 3,
    )

    path.lineTo(
        width + 15,
        y + 16,
    )

    path.lineTo(
        width,
        y + 16,
    )

    path.close()

    p.drawPath(
        path,
        fill=1,
        stroke=0,
    )

    p.restoreState()

    p.setFillColor(WHITE)

    p.setFont(
        "Helvetica-Bold",
        9,
    )

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


def get_product_field(
    product,
    *field_names,
):
    for field in field_names:

        value = getattr(
            product,
            field,
            None,
        )

        if value not in [None, ""]:
            return value

    return ""


# ============================================================
# MAIN PURCHASE INVOICE
# ============================================================

def generate_purchase_invoice(purchase):

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

        p.drawImage(
            ImageReader(
                str(logo_path)
            ),
            45,
            page_height - 140,
            width=240,
            height=125,
            preserveAspectRatio=False,
            anchor="sw",
            mask="auto",
        )

    except Exception as e:

        print(
            "Purchase logo error:",
            e,
        )

        p.setFillColor(DARK)

        p.setFont(
            "Helvetica-Bold",
            30,
        )

        p.drawString(
            55,
            page_height - 70,
            company_name or "FARENI",
        )


    # ========================================================
    # PURCHASE TITLE
    # ========================================================

    p.setFillColor(ORANGE)

    p.setFont(
        "Helvetica-Bold",
        26,
    )

    p.drawRightString(
        page_width - 102,
        page_height - 70,
        "PURCHASE",
    )


    # ========================================================
    # PURCHASE DETAILS
    # ========================================================

    details_x = page_width - 215

    purchase_y = page_height - 94

    draw_label_value(
        p,
        "Purchase No.",
        getattr(
            purchase,
            "purchase_number",
            "",
        ),
        details_x,
        purchase_y,
    )

    draw_label_value(
        p,
        "Invoice No.",
        getattr(
            purchase,
            "invoice_number",
            "",
        ),
        details_x,
        purchase_y - 19,
    )

    draw_label_value(
        p,
        "Date",
        getattr(
            purchase,
            "purchase_date",
            "",
        ),
        details_x,
        purchase_y - 38,
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
    # SUPPLIER
    # ========================================================

    supplier = purchase.supplier

    supplier_name = safe_text(
        getattr(
            supplier,
            "name",
            "",
        )
    )

    supplier_company = safe_text(
        getattr(
            supplier,
            "company_name",
            "",
        )
    )

    supplier_phone = safe_text(
        getattr(
            supplier,
            "phone",
            "",
        )
    )

    supplier_address = safe_text(
        getattr(
            supplier,
            "address",
            "",
        )
    )

    supplier_city = safe_text(
        getattr(
            supplier,
            "city",
            "",
        )
    )

    supplier_state = safe_text(
        getattr(
            supplier,
            "state",
            "",
        )
    )

    supplier_pincode = safe_text(
        getattr(
            supplier,
            "pincode",
            "",
        )
    )

    supplier_gst = safe_text(
        getattr(
            supplier,
            "gst_number",
            "",
        )
    )


    # ========================================================
    # SUPPLIER BOX
    # ========================================================

    box_y = page_height - 285

    left_x = 42

    box_width = 511

    box_height = 92


    draw_section_label(
        p,
        "Supplier:",
        left_x,
        box_y + box_height - 2,
        95,
    )


    draw_box(
        p,
        left_x,
        box_y,
        box_width,
        box_height,
    )


    # ========================================================
    # SUPPLIER LOCATION
    # ========================================================

    location_parts = []

    if supplier_city:
        location_parts.append(
            supplier_city
        )

    if supplier_state:
        location_parts.append(
            supplier_state
        )

    supplier_location = ", ".join(
        location_parts
    )

    if supplier_pincode:

        if supplier_location:

            supplier_location = (
                f"{supplier_location} - "
                f"{supplier_pincode}"
            )

        else:

            supplier_location = (
                supplier_pincode
            )


    # ========================================================
    # SUPPLIER CONTENT
    # ========================================================

    content_x = left_x + 12

    content_y = (
        box_y
        + box_height
        - 15
    )


    p.setFillColor(BLACK)

    p.setFont(
        "Helvetica-Bold",
        9,
    )

    p.drawString(
        content_x,
        content_y,
        supplier_name,
    )


    if supplier_phone:

        draw_right_text(
            p,
            f"Ph: {supplier_phone}",
            left_x + box_width - 12,
            content_y,
            "Helvetica",
            8,
        )


    if supplier_company:

        p.setFillColor(DARK)

        p.setFont(
            "Helvetica",
            8,
        )

        p.drawString(
            content_x,
            content_y - 17,
            supplier_company,
        )


    if supplier_address:

        p.drawString(
            content_x,
            content_y - 34,
            supplier_address[:80],
        )


    if supplier_location:

        p.drawString(
            content_x,
            content_y - 51,
            supplier_location,
        )


    if supplier_gst:

        p.drawString(
            content_x,
            content_y - 68,
            f"GSTIN: {supplier_gst}",
        )


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
        ("DESCRIPTION", 145),
        ("SIZE", 65),
        ("GRADE", 55),
        ("QTY.", 50),
        ("RATE (₹)", 75),
        ("AMOUNT (₹)", 86),
    ]


    # ========================================================
    # TABLE HEADER
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
    # ITEMS
    # ========================================================

    current_y = (
        table_y
        - row_height
    )

    items = purchase.items.all()


    for index, item in enumerate(
        items,
        start=1,
    ):

        product = item.product


        # ----------------------------------------------------
        # PRODUCT
        # ----------------------------------------------------

        description = get_product_field(
            product,
            "name",
            "product_name",
        )


        # ----------------------------------------------------
        # SIZE
        # ----------------------------------------------------

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


        if not size:

            size = get_product_field(
                product,
                "size",
                "dimension",
                "variant",
            )


        # ----------------------------------------------------
        # GRADE
        # ----------------------------------------------------

        grade = get_product_field(
            product,
            "grade",
        )


        # ----------------------------------------------------
        # VALUES
        # ----------------------------------------------------

        quantity = item.quantity

        rate = item.purchase_price

        line_total = item.line_total


        values = [
            index,
            description,
            size or "-",
            grade or "-",
            quantity,
            money(rate),
            money(line_total),
        ]


        # ----------------------------------------------------
        # ROW
        # ----------------------------------------------------

        p.setFillColor(WHITE)

        p.setStrokeColor(DARK)

        p.setLineWidth(0.5)

        p.rect(
            table_x,
            current_y,
            table_width,
            row_height,
            fill=1,
            stroke=1,
        )


        # ----------------------------------------------------
        # COLUMN LINES
        # ----------------------------------------------------

        current_x = table_x

        for _, width in columns[:-1]:

            current_x += width

            p.line(
                current_x,
                current_y,
                current_x,
                current_y + row_height,
            )


        # ----------------------------------------------------
        # TEXT
        # ----------------------------------------------------

        p.setFillColor(BLACK)

        p.setFont(
            "Helvetica",
            7.5,
        )

        current_x = table_x

        for (
            (_, width),
            value,
        ) in zip(
            columns,
            values,
        ):

            text = safe_text(
                value
            )

            if isinstance(
                value,
                (
                    int,
                    float,
                    Decimal,
                ),
            ):

                p.drawRightString(
                    current_x
                    + width
                    - 6,
                    current_y + 8,
                    text,
                )

            else:

                p.drawCentredString(
                    current_x
                    + width / 2,
                    current_y + 8,
                    text,
                )

            current_x += width


        current_y -= row_height


        # ----------------------------------------------------
        # PAGE SAFETY
        # ----------------------------------------------------

        if current_y < 300:
            break


    # ========================================================
    # TOTALS
    # ========================================================

    subtotal = getattr(
        purchase,
        "subtotal",
        Decimal("0"),
    ) or Decimal("0")


    discount = getattr(
        purchase,
        "discount",
        Decimal("0"),
    ) or Decimal("0")


    if discount == 0:

        discount = getattr(
            purchase,
            "discount_amount",
            Decimal("0"),
        ) or Decimal("0")


    gst_amount = getattr(
        purchase,
        "gst_amount",
        Decimal("0"),
    ) or Decimal("0")


    grand_total = getattr(
        purchase,
        "grand_total",
        Decimal("0"),
    ) or Decimal("0")


    # ========================================================
    # GST SPLIT
    # ========================================================

    gst_percent = Decimal("0")

    if items.exists():

        gst_values = [
            Decimal(
                str(
                    item.gst or 0
                )
            )
            for item in items
        ]

        gst_percent = (
            sum(gst_values)
            / Decimal(
                str(
                    len(gst_values)
                )
            )
        )


    cgst = (
        gst_amount
        / Decimal("2")
    )

    sgst = (
        gst_amount
        / Decimal("2")
    )

    cgst_percent = (
        gst_percent
        / Decimal("2")
    )

    sgst_percent = (
        gst_percent
        / Decimal("2")
    )


    # ========================================================
    # TOTAL POSITION
    # ========================================================

    totals_x = 330

    totals_width = 228

    totals_y = (
        current_y
        - 10
    )

    row_h = 27

    separator_x = (
        totals_x
        + 125
    )


    totals_rows = [
        (
            "SUB TOTAL",
            subtotal,
        ),
        (
            "DISCOUNT",
            discount,
        ),
        (
            f"CGST ({cgst_percent:g}%)",
            cgst,
        ),
        (
            f"SGST ({sgst_percent:g}%)",
            sgst,
        ),
    ]


    # ========================================================
    # TOTAL ROWS
    # ========================================================

    for label, value in totals_rows:

        p.setFillColor(WHITE)

        p.setStrokeColor(DARK)

        p.rect(
            totals_x,
            totals_y,
            totals_width,
            row_h,
            fill=1,
            stroke=1,
        )


        p.line(
            separator_x,
            totals_y,
            separator_x,
            totals_y + row_h,
        )


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

    p.rect(
        totals_x,
        totals_y,
        totals_width,
        row_h,
        fill=1,
        stroke=1,
    )


    p.setStrokeColor(DARK)

    p.line(
        separator_x,
        totals_y,
        separator_x,
        totals_y + row_h,
    )


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

    words_y = (
        totals_y
        - 55
    )


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
        "Goods received are subject to verification.",
        "Purchase quantities and rates are as agreed.",
        "Payment to be made as per agreed terms.",
        "All disputes subject to Pune, Maharashtra jurisdiction.",
        "Thank you for your business!",
    ]


    p.setFillColor(DARK)

    p.setFont(
        "Helvetica",
        6.8,
    )


    term_y = (
        bottom_y
        + 39
    )


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

    bank_y = (
        bottom_y
        + 39
    )


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

    signature_y = (
        bottom_y
        + 10
    )


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

    p.setFont(
        "Helvetica-Bold",
        8,
    )

    p.drawCentredString(
        503,
        signature_y - 5,
        "MEET MAKWANA",
    )


    p.setFillColor(DARK)

    p.setFont(
        "Helvetica",
        7,
    )

    p.drawCentredString(
        508,
        signature_y - 13,
        "Managing Director",
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