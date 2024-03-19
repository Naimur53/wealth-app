import AppModal from "../components/ui/AppModal";
import { Avatar, Select } from "antd";
import { FaNairaSign } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import ViewProperty from "../components/property/ViewProperty";
import AppTable from "../components/ui/AppTable";
import { useMemo, useState } from "react";
import { useEditOrderMutation, useGetOrderQuery } from "../redux/features/order/orderApi";
import AppPopover from "../components/ui/AppPopover";
import { IoIosArrowDown } from "react-icons/io";
import { ColumnsType } from "antd/es/table";
import { Order, ResponseSuccessType } from "../types/common";
import { toast } from "react-toastify";
import ViewUser from "../components/manage-user/ViewUser";
import { LuClock } from "react-icons/lu";
import ViewBankInfo from "../components/bank-account/ViewBankInfo";
import { HiOutlineCursorClick } from "react-icons/hi";

const ManageOrder = () => {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState("");
    const [refName, setRefName] = useState("crowdFund");

    const [updateOrder] = useEditOrderMutation();

    const queryString = useMemo(() => {
        const info = {
            // role: "admin",
            limit: 10,
            page,
            refName,
            status: (status.length && status !== "paystack" && status !== "manual") ? status : "",
            paymentType: (status === "paystack" || status === "manual") ? status : "",
        };
        const queryString = Object.keys(info).reduce((pre, key: string) => {
            const value = info[key as keyof typeof info];
            if (value) {
                return pre + `${Boolean(pre.length) ? "&" : ""}${key}=${value}`;
            }
            return pre;
        }, "");
        return queryString;
    }, [page, refName, status]);

    const infoQuery = useGetOrderQuery(queryString);

    const statusOptions = [
        {
            status: "pending"
        },
        {
            status: "success"
        },
        {
            status: "denied"
        },
    ];

    const handleStatusUpdate = async (status: string, id: string) => {
        const updateData = {
            id, status,
            isPaid: true
        }
        await updateOrder(updateData).unwrap().then((res: ResponseSuccessType) => {
            if (!res.success) {
                return toast.error(res?.data.message || "Order state updated unsuccessful!");
            } else {
                toast.success("Order state updated successful!");
            }
        }).catch(res => {
            return toast.error(res?.data.message || "Something went wrong!");
        });
    }

    const handleRefName = (value: string) => {
        setRefName(value);
        setStatus("")
    }

    const convertDate = (value: any) => {
        const date = new Date(value);

        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    const columns: ColumnsType<Order> = [
        {
            title: "",
            dataIndex: refName,
            className: "min-w-[300px] md:min-w-[200px]",
            render: (record: any, fullObj: any) => {
                console.log(fullObj);
                return (
                    <div className="flex items-end capitalize gap-1">
                        <AppModal
                            title="Crowdfunding Property Details"
                            button={
                                <img
                                    src={
                                        fullObj[refName]?.thumbnail
                                    }
                                    alt=""
                                    className="rounded-lg min-w-20 max-w-20 border object-cover 2xl:min-w-32 2xl:max-w-32 h-16 2xl:h-20 cursor-pointer"
                                />
                            }
                        >
                            <ViewProperty readOnly={true} type="currentLocation" record={record} />
                        </AppModal>
                        <div className="w-fit">
                            <p className="text-[#181818] line-clamp-1 text-xs 2xl:text-sm">
                                Property ID: #{fullObj[refName]?.id}
                            </p>
                            <div className="pt-2">
                                <p className="text-[#6B6B6F] text-xs 2xl:text-sm">Property Name</p>
                                <h2 className="text-[#181818] text-xs 2xl:text-sm font-medium">{fullObj[refName]?.title}</h2>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "",
            dataIndex: refName,
            className: "min-w-[150px] md:min-w-[120px]",
            render: (record: any, fullObj: any) => {
                return (
                    <div className="flex flex-col justify-end capitalize h-20 2xl:h-24">
                        <p className="text-[#6B6B6F] text-sm">Location</p>
                        <div className="pt-1 flex items-center gap-0.5 md:gap-1">
                            <GrLocation className="text-[#7CAA38] text-base" />
                            <h2 className="text-textDark line-clamp-1">{fullObj[refName]?.streetLocation}</h2>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "",
            dataIndex: refName,
            className: "min-w-[100px] md:min-w-[80px]",
            render: (record: any, fullObj: any) => {
                return (
                    <div className="flex flex-col justify-end capitalize h-20 2xl:h-24">
                        <p className="text-[#6B6B6F] text-sm">Buyer</p>
                        <div className="pt-1 flex items-center gap-1">
                            <Avatar src={fullObj?.orderBy?.profileImg} size={"small"} />
                            <AppModal title="User Details" button={
                                <p className="cursor-pointer text-sm">{fullObj?.orderBy?.name}</p>
                            } >
                                <ViewUser onlyView={true} role="User" record={fullObj?.orderBy} />
                            </AppModal>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "",
            dataIndex: refName,
            className: "min-w-[150px] md:min-w-[130px]",
            render: (record: any, fullObj: any) => {
                return (
                    <div className="flex flex-col justify-end capitalize h-20 2xl:h-24">
                        <p className="text-[#6B6B6F] text-sm">Payment Method</p>
                        <div className="pt-1 flex items-center gap-1">
                            {fullObj?.paymentType === "paystack" ?
                                <h2 className="text-textDark text-sm">{fullObj?.paymentType}</h2>
                                :
                                <AppModal title="Account Details" button={
                                    <h2 className="text-textDark text-sm cursor-pointer flex items-center gap-1">{fullObj?.paymentType} <HiOutlineCursorClick /></h2>
                                } >
                                    <ViewBankInfo record={fullObj?.wealthBank} readOnly={true} />
                                </AppModal>
                            }
                        </div>
                    </div>
                );
            },
        },
        {
            title: "",
            dataIndex: refName,
            className: "min-w-[150px] md:min-w-[120px]",
            render: (record: any, fullObj: any) => {
                return (
                    <div className="flex flex-col justify-end capitalize h-20 2xl:h-24">
                        <p className="text-[#6B6B6F] text-sm">Date</p>
                        <div className="pt-1 flex items-center gap-1">
                            <LuClock className="text-[#7CAA38]" />
                            <h2 className="text-textDark">{convertDate(fullObj?.createdAt)}</h2>
                        </div>
                    </div>
                );
            },
        },

        {
            title: "",
            dataIndex: refName,
            className: "min-w-[100px]",
            render: (record: any, fullObj: any) => {
                return (
                    <div className="flex flex-col justify-end capitalize h-20 2xl:h-24">
                        <p className="text-[#6B6B6F] text-sm">Status</p>
                        <div className="pt-1 flex items-center gap-1">
                            <AppPopover
                                arrow={false}
                                button={
                                    <div className={`flex items-center gap-1 text-textDark text-sm  rounded-full px-4 py-0.5 bg-[#FCF0C9] ${fullObj?.status === "success" && "bg-green-500 text-white"} ${fullObj?.status === "denied" && "bg-red-500 text-white"} ${fullObj?.status === "pending" && "cursor-pointer"}`}>
                                        <h3>{fullObj?.status}</h3>{fullObj?.status === "pending" && <IoIosArrowDown />}
                                    </div>
                                }
                            >
                                {fullObj?.status === "pending" && <div className='flex flex-col items-end text-end'>
                                    {statusOptions.map(stat => (
                                        <AppModal
                                            key={stat.status}
                                            button={
                                                <button className="hover:bg-blue-50 w-full">{stat.status}</button>
                                            }
                                            cancelButtonTitle="No, Don’t"
                                            primaryButtonTitle="Yes. Update"
                                            primaryButtonAction={() => handleStatusUpdate(stat.status, fullObj?.id)}
                                        >
                                            <div className="max-w-80">
                                                <p className="text-center text-[#828282] pt-4 text-lg">
                                                    Are you sure Update status {fullObj?.status} to
                                                    <span className="text-textDark font-medium">
                                                        {" "}{stat.status}
                                                    </span>{" "}
                                                    from this current property?
                                                </p>
                                            </div>
                                        </AppModal>
                                    ))}
                                </div>}
                            </AppPopover>
                        </div>
                    </div>
                );
            },
        },
    ];

    if (refName === "crowdFund") {
        columns.splice(4, 0,
            {
                title: "",
                dataIndex: refName,
                className: "min-w-[120px] md:min-w-[100px]",
                render: (record: any, fullObj: any) => {
                    return (
                        <div className="flex flex-col justify-end h-20 2xl:h-24">
                            <p className="text-[#6B6B6F] text-sm">Fund Raised</p>
                            <div className="pt-1 flex items-center gap-1">
                                <FaNairaSign className="text-textDark" />
                                <h2 className="text-textDark">{fullObj[refName]?.fundRaised}</h2>
                            </div>
                        </div>
                    );
                },
            },
            {
                title: "",
                dataIndex: refName,
                className: "min-w-[120px] md:min-w-[100px]",
                render: (record: any, fullObj: any) => {
                    return (
                        <div className="flex flex-col justify-end h-20 2xl:h-24">
                            <p className="text-[#6B6B6F] text-sm">Target Fund</p>
                            <div className="pt-1 flex items-center gap-1">
                                <FaNairaSign className="text-textDark" />
                                <h2 className="text-textDark">{fullObj[refName]?.targetFund}</h2>
                            </div>
                        </div>
                    );
                },
            },)
    }

    if (refName !== "crowdFund") {
        columns.splice(3, 0,
            {
                title: "",
                dataIndex: refName,
                className: "min-w-[120px]",
                render: (record: any, fullObj: any) => {
                    return (
                        <div className="flex flex-col justify-end h-20 2xl:h-24">
                            <p className="text-[#6B6B6F] text-sm">price</p>
                            <div className="pt-1 flex items-center gap-1">
                                <FaNairaSign className="text-textDark" />
                                <h2 className="text-textDark">{fullObj[refName]?.price}</h2>
                            </div>
                        </div>
                    );
                },
            },)
    }
    return (
        <AppTable
            header={false}
            columns={columns}
            infoQuery={infoQuery}
            setPage={setPage}
            headerText="Order List"
            tabs={
                <div className='flex items-center gap-2 w-full md:w-3/5'>
                    <button onClick={() => handleRefName("crowdFund")} className={`${refName === "crowdFund" ? "roundedBtn" : "roundedBtn text-textDark bg-[#E6E6E7]"}`}>Crowdfunding</button>
                    <button onClick={() => handleRefName("property")} className={`${refName === "property" ? "roundedBtn" : "roundedBtn text-textDark bg-[#E6E6E7]"}`}>Current Location</button>
                    <button onClick={() => handleRefName("flipping")} className={`${refName === "flipping" ? "roundedBtn" : "roundedBtn text-textDark bg-[#E6E6E7]"}`}>Flipping</button>
                </div>
            }
            button={
                <div className={`flex cursor-pointer items-center gap-1.5 text-textDark`}>
                    <h3>Short by</h3> <Select
                        style={{ width: 120 }}
                        placeholder="Select Status"
                        className="focus-visible:!ring-0 focus:!ring-0"
                        value={status}
                        onChange={(value) => setStatus(value)}
                        options={[
                            { value: '', label: 'All Order' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'success', label: 'Success' },
                            { value: 'denied', label: 'Denied' },
                            { value: 'paystack', label: 'paystack' },
                            { value: 'manual', label: 'manual' },
                        ]}
                    />
                </div>
            }
        />
    );
};

export default ManageOrder;