/* eslint-disable react/prop-types */
import { useRef } from "react";
import useDataTable from "../hooks/useDataTable";
import { formatDateMMDDYYYY, formatDateMMDDYYYYHHIIA } from "../libs/helpers";
import FlatIcon from "./FlatIcon";
import ActionBtn from "./buttons/ActionBtn";
import Pagination from "./table/Pagination";
import Table from "./table/Table";
import NewAppointmentModal from "./modal/NewAppointmentModal";
import { v4 as uuidv4 } from "uuid";
import Tippy from "@tippyjs/react";
import ShowAppointmentModal from "./modal/ShowAppointmentModal";
import { useAuth } from "../hooks/useAuth";
import ContentTitle from "./buttons/ContentTitle";
import CreatePrescriptionModal from "./patient-modules/modals/CreatePrescriptionModal";
import SelectItemModal from "./modal/SelectItemModal";
const uniq_id = uuidv4();
const PatientAppointments = (props) => {
	const { patient } = props;
	const { user } = useAuth();
	const appointmentRef = useRef(null);
	const showAppointmentModal = useRef(null);
	const createPrescriptionRef = useRef(null);
	const selecItemRef = useRef(null);

	const {
		page,
		setPage,
		meta,
		setMeta,
		loading,
		setLoading,
		paginate,
		setPaginate,
		data,
		setData,
		column,
		setColumn,
		direction,
		setDirection,
		filters,
		setFilters,
	} = useDataTable({
		url: `v1/clinic/appointments/${patient?.id}`,
		defaultFilters: {
			status: "done",
			patient_id: patient?.id,
			key: uniq_id,
		},
	});
	return (
		<div className="flex flex-col items-start">
			<ContentTitle title="Past Appointments" />

			<Table
				className={`pb-2`}
				loading={loading}
				columns={[
					{
						header: "Date and time",
						className: "w-[220px] text-left",
						tdClassName: "text-left",
						key: "date",
						cell: (data) => {
							return (
								<div className="flex flex-col">
									<span className="text-slate-800 font-[500] flex items-center ">
										<span className="-mb-[2px] mr-2">
											<FlatIcon icon="rr-calendar" />
										</span>
										{formatDateMMDDYYYYHHIIA(
											new Date(data?.created_at)
										)}
									</span>
								</div>
							);
						},
					},
					{
						header: "Doctor",
						className: "text-left",
						tdClassName: "text-left",
						key: "doctor",
						cell: (data) => {
							return `${data?.referredToDoctor?.title || "Dr."} ${
								data?.referredToDoctor?.name || "-"
							}`;
						},
					},
					{
						header: "Chief complaint",
						className: "w-[] text-left",
						tdClassName: "text-left",
						key: "pre_notes",
					},
					{
						header: "Status",
						className: "w-[200px] text-left",
						tdClassName: "text-left",
						key: "status",
					},
					{
						header: "Action",
						className: `w-[250px] hidden ${
							user?.type == "rhu-nurse" ||
							user?.type == "RHU-NURSE" ||
							user?.type == "his-nurse" ||
							user?.type == "HIS-NURSE" ||
							user?.type == "his-opd-nurse" ||
							user?.type == "HIS-OPD-NURSE"
								? "hidden"
								: ""
						}`,
						tdClassName: `text-center hidden ${
							user?.type == "rhu-nurse" ||
							user?.type == "RHU-NURSE" ||
							user?.type == "his-nurse" ||
							user?.type == "HIS-NURSE" ||
							user?.type == "his-opd-nurse" ||
							user?.type == "HIS-OPD-NURSE"
								? "hidden"
								: ""
						}`,
						key: "action",
						cell: (data) => {
							return (
								<div className="flex items-center justify-center flex-wrap gap-2">
									<ActionBtn
										size="xs"
										type=""
										onClick={() => {
											showAppointmentModal.current.show(
												data
											);
										}}
									>
										<FlatIcon
											icon="rr-eye"
											className="mr-2"
										/>
										View
									</ActionBtn>
									<ActionBtn
										size="xs"
										type="success"
										onClick={() => {
											createPrescriptionRef.current.show(
												data
											);
										}}
									>
										<FlatIcon
											icon="rr-square-plus"
											className="mr-2"
										/>
										Add prescription
									</ActionBtn>
									<ActionBtn
										size="xs"
										// type="success"
										onClick={() => {
											showAppointmentModal.current.show(
												data
											);
										}}
									>
										<FlatIcon
											icon="rr-plus"
											className="mr-2"
										/>
										Create Laboratory order
									</ActionBtn>
									{/* <Tippy content="Click to update as done">
										<ActionBtn
											className="mx-2"
											type="success"
										>
											<FlatIcon icon="rr-check" />
										</ActionBtn>
									</Tippy> */}
								</div>
							);
						},
					},
				]}
				data={data}
			/>
			<Pagination
				page={page}
				setPage={setPage}
				pageCount={meta?.last_page}
				pageSize={paginate}
				setPageSize={setPaginate}
			/>
			<NewAppointmentModal
				ref={appointmentRef}
				onSuccessCallBack={() => {
					setFilters((prevFilters) => ({
						...prevFilters,
						key: uuidv4(),
					}));
				}}
			/>

			<ShowAppointmentModal ref={showAppointmentModal} />

			<CreatePrescriptionModal
				ref={createPrescriptionRef}
				selecItemRef={selecItemRef}
			/>
			<SelectItemModal ref={selecItemRef} />
		</div>
	);
};

export default PatientAppointments;
