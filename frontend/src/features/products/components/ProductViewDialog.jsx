import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ProductViewDialog({
    open,
    onOpenChange,
    product,
}) {
    if (!product) return null;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-2xl">

                <DialogHeader>
                    <DialogTitle>
                        Product Details
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 text-sm">

                    <p><strong>Code:</strong> {product.product_code}</p>

                    <p><strong>Name:</strong> {product.name}</p>

                    <p><strong>Brand:</strong> {product.brand_name}</p>

                    <p><strong>Grade:</strong> {product.grade}</p>

                    <p><strong>Material:</strong> {product.material}</p>

                    <p>
                    <strong>Category:</strong>{" "}
                    {product.category_name}
                    </p>

                    <p>
                    <strong>Product Type:</strong>{" "}
                    {product.product_type_name}
                    </p>

                    <p>
                    <strong>Size:</strong>{" "}
                    {product.product_size_name}
                    </p>

                    <p>
                    <strong>Length:</strong>{" "}
                    {product.product_length_name || "-"}
                    </p>

                    <p>
                    <strong>Standard:</strong>{" "}
                    {product.standard || "-"}
                    </p>                  
                    {/* <p><strong>Thread Pitch:</strong> {product.size}</p> */}

                    <p><strong>Unit:</strong> {product.unit}</p>

                    <p><strong>Purchase:</strong> ₹{product.purchase_price}</p>

                    <p><strong>Selling:</strong> ₹{product.selling_price}</p>

                    <p><strong>GST:</strong> {product.gst}%</p>

                    <p><strong>Current Stock:</strong> {product.current_stock}</p>

                    <p><strong>Minimum Stock:</strong> {product.minimum_stock}</p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {product.is_active ? "Active" : "Inactive"}
                    </p>

                </div>

            </DialogContent>
        </Dialog>
    );
}