import { useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

type TCollapseData = {
    data: {
        question: string;
        ans: string;
    }
}

const CollapseDiv = ({ data }: TCollapseData) => {
    const [open, setOpen] = useState(false);
    return (
        <div className=' border border-[#E6E6E7] rounded-lg'>
            <div onClick={() => setOpen(prev => !prev)} className='px-4 py-2.5 flex items-center justify-between hover:bg-gray-100 cursor-pointer'>
                <h2 className="font-semibold text-textDark">{data?.question}</h2>
                {open ?
                    <SlArrowUp />
                    : <SlArrowDown />
                }
            </div>
            {open && <p className="text-sm px-4 py-2 text-[#6B6B6F]">{data?.ans}</p>}
        </div>
    );
};

export default CollapseDiv;