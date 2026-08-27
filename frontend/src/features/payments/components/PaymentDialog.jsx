import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Button
} from "@/components/ui/button";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreatePayment } from "../hooks/useCreatePayment";
import { useUpdatePayment } from "../hooks/useUpdatePayment";
import { useCustomers } from "../hooks/useCustomers";

export default function PaymentDialog({
    open,
    payment,
    onOpenChange,
}) {


    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState:{
            errors
        },
    } = useForm();

    const {
        data: customersData
    } = useCustomers();


    const customers =
        customersData?.results || [];
        
    const createMutation =
        useCreatePayment();


    const updateMutation =
        useUpdatePayment();



    const paymentType =
        watch("payment_type");
    

    useEffect(() => {

        if(payment){

            reset({

                payment_date:
                    payment.payment_date,

                payment_type:
                    payment.payment_type,

                customer:
                    payment.customer,

                supplier:
                    payment.supplier,

                amount:
                    payment.amount,

                payment_mode:
                    payment.payment_mode,

                reference_number:
                    payment.reference_number,

                remarks:
                    payment.remarks,

            });

        }
        else{

            reset({
                payment_date:
                    new Date()
                    .toISOString()
                    .split("T")[0],

                payment_type:"RECEIVED",
            });

        }


    },[
        payment,
        reset,
    ]);



    const onSubmit = (data)=>{

        console.log("Payment DATA:",data);
        if(data.customer){
            data.customer = Number(data.customer);
        }
        if(data.supplier){
            data.supplier = Number(data.supplier);
        }
        if(payment){
            updateMutation.mutate({
                id:payment.id,
                data,
            });
        }
        else{
            createMutation.mutate(data);
        }
        onOpenChange(false);
    };

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent
                className="max-w-lg"
            >

                <DialogHeader>

                    <DialogTitle>
                        {
                            payment
                            ?
                            "Edit Payment"
                            :
                            "Add Payment"
                        }
                    </DialogTitle>

                </DialogHeader>

                <form
                    onSubmit={
                        handleSubmit(onSubmit)
                    }
                    className="space-y-4"
                >
                    <input
                        type="date"
                        className="input"
                        {...register(
                            "payment_date",
                            {
                                required:true
                            }
                        )}
                    />
                    <select
                        className="input"
                        {...register(
                            "payment_type"
                        )}
                    >

                        <option value="RECEIVED">
                            Received
                        </option>

                        <option value="PAID">
                            Paid
                        </option>

                    </select>
                    {
                    paymentType==="RECEIVED"
                    &&
                    <select
                        className="input"
                        {...register("customer")}
                    >

                    <option value="">
                        Select Customer
                    </option>


                    {
                    customers.map((customer)=>(
                        <option
                            key={customer.id}
                            value={customer.id}
                        >
                            {customer.customer_code} - {customer.name}
                        </option>
                    ))
                    }


                    </select>
                    }
                    {
                    paymentType==="PAID"
                    &&
                    <input
                        type="number"
                        placeholder="Supplier ID"
                        className="input"
                        {...register(
                            "supplier"
                        )}
                    />
                    }
                    <input
                        placeholder="Amount"
                        type="number"
                        className="input"
                        {...register(
                            "amount",
                            {
                                required:true
                            }
                        )}
                    />
                    <select
                        className="input"
                        {...register(
                            "payment_mode"
                        )}
                    >

                        <option value="CASH">
                            Cash
                        </option>

                        <option value="UPI">
                            UPI
                        </option>

                        <option value="BANK">
                            Bank Transfer
                        </option>

                        <option value="CHEQUE">
                            Cheque
                        </option>

                    </select>
                    <input
                        placeholder="Reference Number"
                        className="input"
                        {...register(
                            "reference_number"
                        )}
                    />
                    <textarea
                        placeholder="Remarks"
                        className="input"
                        {...register(
                            "remarks"
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Save Payment
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}