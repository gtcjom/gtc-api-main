import { useEffect, useRef, useState } from "react";
import AppLayout from "../../components/container/AppLayout";
import useNoBugUseEffect from "../../hooks/useNoBugUseEffect";
import PageHeader from "../../components/layout/PageHeader";
import InServiceItem from "./components/InServiceItem";
import FlatIcon from "../../components/FlatIcon";
import InQueuePriority from "./components/InQueuePriority";
import InQueueRegular from "./components/InQueueRegular";
import useQueue from "../../hooks/useQueue";
import { patientFullName } from "../../libs/helpers";
import ReferToSPHModal from "../../components/modal/ReferToSPHModal";
import { useAuth } from "../../hooks/useAuth";
import useDoctorQueue from "../../hooks/useDoctorQueue";
import InQueueForRelease from "./components/InQueueForRelease";
import { Fade } from "react-reveal";
import PatientInfo from "../patients/components/PatientInfo";
import AppointmentDetails from "../appointments/components/AppointmentDetails";
import AppointmentDetailsForNurse from "../appointments/components/AppointmentDetailsForNurse";
import ActionBtn from "../../components/buttons/ActionBtn";

const Status = ({ appointment }) => {
	const renderStatus = () => {
		if (appointment?.has_for_reading?.length > 0) {
			return (
				<span className="text-orange-500">
					Pending for Result Reading
				</span>
			);
		}
		if (appointment?.status == "pending" && appointment?.vital_id == null) {
			return (
				<span className="text-orange-500">
					Pending for patient vitals {appointment?.vital_id}
				</span>
			);
		}
		if (appointment?.status == "pending" && appointment?.vital_id != null) {
			return <span className="text-orange-600">Pending for service</span>;
		}
		if (
			appointment?.status == "pending-doctor-confirmation" &&
			appointment?.vital_id != null &&
			appointment?.referred_to != null
		) {
			return (
				<span className="text-orange-600">
					Pending for doctor&apos;s confirmation
				</span>
			);
		}
		if (
			appointment?.status == "pending-for-pharmacy-release" &&
			appointment?.prescribed_by == null
		) {
			return (
				<span className="text-orange-600">For Doctor Prescription</span>
			);
		}
		if (
			appointment?.status == "pending-for-pharmacy-release" &&
			appointment?.prescribed_by != null
		) {
			return (
				<span className="text-orange-600">For Medicine release</span>
			);
		}
		if (appointment?.status == "in-service-consultation") {
			return (
				<span className="text-orange-600">
					CONSULTATION WITH DOCTOR
				</span>
			);
		}
		return (
			<span className="text-red-600 uppercase">
				{String(appointment?.status).replaceAll("-", " ")}
			</span>
		);
	};
	return renderStatus();
};
const PatientQueue = () => {
	const { user } = useAuth();
	const {
		pending: doctorsPending,
		nowServing: doctorsNowServing,
		mutatePending,
		mutatePendingForResultReading,
		mutateNowServing,
	} = useDoctorQueue();
	const {
		pending,
		pendingForRelease,
		mutatePendingForRelease,
		mutatePendingPatient,
		mutateNowServingPatient,
	} = useQueue();
	const referToSphModalRef = useRef(null);
	const [appointment, setAppointment] = useState(null);
	useNoBugUseEffect({
		functions: () => {},
	});
	const isDoctor = () => {
		return user?.type == "rhu-doctor" || user?.type == "RHU-DOCTOR"
		|| user?.type == "his-doctor" || user?.type == "HIS-DOCTOR"
		|| user?.type == "his-md" || user?.type == "HIS-MD";
	};

	const listPending = () => {
		return (isDoctor() ? doctorsPending?.data : pending?.data) || [];
	};
	const mutateAll = () => {
		mutatePending();
		mutatePendingForResultReading();
		mutateNowServing();
		mutatePendingForRelease();
		//mutatePendingPatient();
		//mutateNowServingPatient();
	};
	return (
		<AppLayout>
			{/* <PageHeader
				title="Patient Queue"
				subtitle={"View patients in queue"}
				icon="rr-clipboard-list-check"
			/> */}
			<div className="p-4 h-full overflow-auto ">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 divide-x">
					<div className="lg:col-span-4">
						<h1 className="text-xl font-bold font-opensans text-primary-dark tracking-wider -mb-1">
							Patient Queue
						</h1>
						<span className="noto-sans-thin text-slate-500 text-sm font-light">
							Patients pending for service
						</span>
						<div className="flex flex-col gap-y-4 py-4">
							{/* <span className="font-medium text-md text-orange-500 -mb-2 ">
								Priority Lane
							</span> */}
							{/* <InQueuePriority
								number="3"
								patientName="Raelyn Cameron"
								priorityType="PWD"
							/>
							<InQueuePriority
								number="4"
								patientName="Kamdyn Castillo"
								priorityType="PWD"
							/> */}
							{/* <span className="border-b border-b-slate-100"></span> */}
							{/* <span className="font-medium text-md text-blue-500 -mb-2 ">
								Regular
							</span> */}
							{pendingForRelease?.data?.map((queue, index) => {
								return (
									<InQueueForRelease
										selected={queue?.id == appointment?.id}
										onClick={() => {
											setAppointment(queue);
										}}
										key={`iqr-${queue.id}`}
										number={`${queue.id}`}
										patientName={patientFullName(
											queue?.patient
										)}
									>
										<div className="w-full flex flex-col pl-16">
											<div className="flex items-center text-slate-700 gap-2 mb-2">
												<span className="text-sm">
													Status:
												</span>
												<span className="font-bold text-sm text-red-600">
													{"PENDING FOR RELEASE"}
												</span>
											</div>
										</div>
									</InQueueForRelease>
								);
							})}
							{listPending()?.map((queue, index) => {
								return (
									<InQueueRegular
										referAction={() => {
											referToSphModalRef.current.show(
												queue
											);
										}}
										onClick={() => {
											if (
												queue.status !=
												"pending-doctor-consultation"
											) {
												setAppointment(queue);
											} else {
												setAppointment(null);
											}
										}}
										selected={queue?.id == appointment?.id}
										key={`iq2-${queue.id}`}
										number={`${queue.id}`}
										patientName={patientFullName(
											queue?.patient
										)}
									>
										<div className="w-full flex flex-col pl-16">
											<div className="flex items-center text-slate-700 gap-2 mb-2">
												<span className="text-sm">
													Status:
												</span>
												<span className="font-bold text-sm">
													<Status
														appointment={queue}
													/>
												</span>
											</div>
										</div>
									</InQueueRegular>
								);
							})}

							{/* <InQueueRegular
								number="6"
								patientName="Mylo Daugherty"
							/>
							<InQueueRegular
								number="7"
								patientName="Emmeline Larson"
							/> */}
						</div>
					</div>
					<div className="lg:col-span-8 pl-4">
						<div className="flex items-center">
							<h1 className="text-xl font-bold font-opensans text-success-dark tracking-wider -mb-1">
								In Service...
							</h1>
						</div>
						<span className="mb-3 noto-sans-thin text-slate-500 text-sm font-light">
							&nbsp;
						</span>
						<div>
							{appointment?.patient ? (
								<Fade key={`order-${appointment?.id}`}>
									<div>
										<h4 className="border flex items-center text-base font-bold p-2 mb-0 border-indigo-100 lg:col-span-12">
											<span>Patient Information</span>
											<ActionBtn
												className="ml-auto"
												type="danger"
												onClick={() => {
													setAppointment(null);
												}}
											>
												Close
											</ActionBtn>
										</h4>
										<div className="flex flex-col lg:flex-row gap-2 border-x border-indigo-100 p-4">
											<PatientInfo
												patient={appointment?.patient}
											/>
										</div>
										<div className="pb-4">
											<AppointmentDetailsForNurse
												appointment={appointment}
												mutateAll={mutateAll}
												setOrder={(data) => {
													if (data == null) {
														// mutateAll();
													}
													setAppointment(data);
												}}
											/>
										</div>
									</div>
								</Fade>
							) : (
								""
							)}
						</div>
						{appointment?.id ? (
							""
						) : (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								{doctorsNowServing?.data?.map((data) => {
									return (
										<InServiceItem
											key={`PQInServiceItem-${data?.id}`}
											data={data}
											// room="121"
											// patientQueueName="#1 - Justin Rasmussen"
											// doctor={{
											// 	title: "Dr.",
											// 	name: "Corinne Fitzgerald",
											// 	specialty:
											// 		"Gastroenterologists",
											// }}
										/>
									);
								})}
								{/* <InServiceItem
								room="152"
								patientQueueName="#2 - Camilo Pacheco"
								doctor={{
									title: "Dr.",
									name: "Tanya White",
									specialty: "Cardiologists",
								}}
							/> */}
							</div>
						)}
					</div>
				</div>
			</div>
			<ReferToSPHModal ref={referToSphModalRef} />
		</AppLayout>
	);
};

export default PatientQueue;
