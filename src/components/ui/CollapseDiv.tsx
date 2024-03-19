import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import AppModal from "./AppModal";
import { toast } from "react-toastify";
import { useDeleteFaqMutation } from "../../redux/features/faq/faqApi";

type TCollapseData = {
    data: {
        id: string;
        question: string;
        ans: string;
    }
}

const CollapseDiv = ({ data }: TCollapseData) => {
    const [open, setOpen] = useState(false);
    const [deleteFaq, { isError, isSuccess, isLoading }] = useDeleteFaqMutation();

    useEffect(() => {
        if (isError) {
            toast.error("FAQ delete unsuccessful!");
        } else if (!isLoading && isSuccess) {
            toast.success('FAQ deleted Successful!')
        }
    }, [isError, isLoading, isSuccess])


    return (
        <div className=' border border-[#E6E6E7] rounded-lg'>
            <div className='px-4 py-2.5 flex items-center justify-between'>
                <h2 className="font-semibold text-textDark">{data?.question}</h2>
                <div className='flex items-center gap-5'>
                    {open ?
                        <SlArrowUp className="cursor-pointer" onClick={() => setOpen(prev => !prev)} />
                        : <SlArrowDown className="cursor-pointer" onClick={() => setOpen(prev => !prev)} />
                    }
                    <AppModal button={
                        <button className='text-xl hover:text-bgred'><AiOutlineDelete /></button>}
                        cancelButtonTitle="No, Don’t"
                        primaryButtonTitle="Yes. Remove"
                        primaryButtonAction={() => deleteFaq(data?.id)}
                    >
                        <div className='max-w-80'>
                            <p className="text-center text-[#828282] pt-4 text-lg">Are you sure delete <span className="text-textDark font-medium">{data?.question}</span> from the FAQ list?</p>
                        </div>
                    </AppModal>
                </div>
            </div>
            {open && <p className="text-sm px-4 py-2 text-[#6B6B6F]">{data?.ans}</p>}
        </div>
    );
};

export default CollapseDiv;