import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddPropertyStateMutation } from "../../redux/features/propertyState/propertyStateApi";
import AppDatePicker from "../ui/AppDatePicker";
import SmallLoading from "../ui/SmallLoading";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCirclePlus } from "react-icons/fa6";

type FormData = {
    amounts: {
        price: any;
        time: string;
    }[];
};

type TAddNewPropertyState = {
    closeModal?: () => void;
    propertyId: string;
}

const AddNewPropertyState = ({ propertyId, closeModal }: TAddNewPropertyState) => {
    const [addPropertyState, { isLoading }] = useAddPropertyStateMutation();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            amounts: [{ price: "", time: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        name: "amounts",
        control
    })

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const submitData = data.amounts.map(amount => ({
            ...amount, propertyId
        }));
        console.log(submitData);
        await addPropertyState(submitData).unwrap().then((res: any) => {
            if (!res.success) {
                toast.error(res?.data.message || "Something went wrong", { toastId: 1 });
            }
            toast.success("Property state are Added successfully!", { toastId: 1 });
            reset();
            if (closeModal) {
                closeModal();
            }
        }).catch(res => {
            if (!res.success) {
                toast.error(res?.data.message || "Something went wrong", { toastId: 1 });
            }
        });
    }
    return (
        <div className='w-[560px]'>
            <form className="flex flex-col gap-4 2xl:gap-6 py-2" onSubmit={handleSubmit(onSubmit)}>
                {
                    fields.map((field, index) => (
                        <div key={field.id} className='flex items-center gap-4'>
                            <div className='w-[94%] grid grid-cols-2 gap-4 2xl:gap-6'>
                                <div className='flex flex-col text-textDark'>
                                    <label htmlFor={`price-${index}`}>Add Amount</label>
                                    <input
                                        type="number"
                                        id={`price-${index}`}
                                        className={`input ${errors?.amounts?.[index]?.price && 'border-2 border-bgred  '}`}
                                        placeholder="Type your account number"
                                        {...register(`amounts.${index}.price` as const, { required: true, valueAsNumber: true })}
                                    />
                                    {errors?.amounts?.[index]?.price && <p className="text-bgred"> Add Amount field is required.</p>}
                                </div>

                                <AppDatePicker
                                    control={control}
                                    label="Date"
                                    name={`amounts.${index}.time`}
                                    placeholder="Select Date"
                                />
                            </div>

                            {index > 0 && (
                                <button type="button" className="text-xl cursor-pointer hover:text-bgred" onClick={() => remove(index)}>
                                    <AiOutlineDelete />
                                </button>
                            )}
                        </div>
                    ))
                }

                <div className='flex items-center justify-center gap-4'>
                    {isLoading ? <SmallLoading />
                        :
                        <>
                            <button type="button" className="roundedBtn flex items-center gap-1 w-fit" onClick={() => append({ price: "", time: "" })}>
                                <FaCirclePlus /> Add Amount Field
                            </button>
                            <input type="submit" className="roundedBtn cursor-pointer" value={"Submit"} />
                        </>
                    }
                </div>
            </form>
        </div>
    );
};

export default AddNewPropertyState;