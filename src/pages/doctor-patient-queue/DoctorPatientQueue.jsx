import { useEffect, useRef, useState } from "react";
import AppLayout from "../../components/container/AppLayout";
import useNoBugUseEffect from "../../hooks/useNoBugUseEffect";
import PageHeader from "../../components/layout/PageHeader";
import FlatIcon from "../../components/FlatIcon";
import DoctorInQueueRegular from "./components/DoctorInQueueRegular";
import useQueue from "../../hooks/useQueue";
import {
	formatDate,
	formatDateTime,
	patientFullName,
} from "../../libs/helpers";
import ReferToSPHModal from "../../components/modal/ReferToSPHModal";
import { useAuth } from "../../hooks/useAuth";
import useDoctorQueue from "../../hooks/useDoctorQueue";
import ConsultPatientModal from "./components/ConsultPatientModal";
import DoctorInServiceItem from "./components/DoctorInServiceItem";
import PatientProfileModal from "../../components/PatientProfileModal";
import DoctorInQueuePriority from "./components/DoctorInQueuePriority";
import PendingOrdersModal from "../../components/PendingOrdersModal";

const DoctorPatientQueue = () => {
	const { user } = useAuth();
	const {
		pending: doctorsPending,
		nowServing: doctorsNowServing,
		pendingForResultReading,
		mutatePending,
		mutatePendingForResultReading,
		mutateNowServing,
	} = useDoctorQueue();
	const { pending, nowServing } = useQueue();
	const referToSphModalRef = useRef(null);
	const patientProfileRef = useRef(null);
	const acceptPatientRef = useRef(null);
	const pendingOrdersRef = useRef(null);

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
							In Queue
						</h1>
						<span className="noto-sans-thin text-slate-500 text-sm font-light">
							Patients pending for doctor acceptance
						</span>
						<div className="flex flex-col gap-y-4 py-4">
							{listPending()?.length == 0 &&
							pendingForResultReading?.data?.length == 0 ? (
								<div className="text-slate-300 py-20 text-center">
									No patient in queue.{" "}
								</div>
							) : (
								""
							)}
							{pendingForResultReading?.data?.map((queue) => {
								if (
									queue.status != "in-service-result-reading"
								) {
									console.log("queuequeuequeue", queue);
									return (
										<DoctorInQueuePriority
											labOrdersStr={JSON.stringify(
												queue?.lab_orders
											)}
											date={formatDate(
												new Date(queue?.created_at)
											)}
											acceptAction={() => {
												acceptPatientRef.current.show(
													queue
												);
											}}
											key={`iqr-prio-${queue.id}`}
											number={`${queue.id}`}
											patientName={patientFullName(
												queue?.patient
											)}
										/>
									);
								}
							})}
							{listPending()?.map((queue, index) => {
								return (
									<DoctorInQueueRegular
										date={formatDate(
											new Date(queue?.created_at)
										)}
										acceptAction={() => {
											acceptPatientRef.current.show(
												queue
											);
										}}
										key={`iqr-${queue.id}`}
										number={`${queue.id}`}
										patientName={patientFullName(
											queue?.patient
										)}
									/>
								);
							})}
						</div>
					</div>
					<div className="lg:col-span-8 pl-4">
						<h1 className="text-xl font-bold font-opensans text-success-dark tracking-wider -mb-1">
							In Service...
						</h1>
						<span className="mb-3 noto-sans-thin text-slate-500 text-sm font-light">
							&nbsp;
						</span>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{doctorsNowServing?.data?.map((data) => {
								return (
									<DoctorInServiceItem
										data={data}
										labOrdersStr={JSON.stringify(
											data?.lab_orders
										)}
										pendingOrdersRef={pendingOrdersRef}
										key={`DoctorInServiceItem-${data?.id}`}
										openProfileAction={() => {
											patientProfileRef.current.show(
												data
											);
										}}
									/>
								);
							})}
							{doctorsNowServing?.data?.length == 0 ? (
								<span className="py-20 text-center lg:col-span-2 text-slate-500 text-lg font-bold">
									No data available.
								</span>
							) : (
								""
							)}
						</div>
					</div>
				</div>
			</div>
			<ReferToSPHModal ref={referToSphModalRef} mutateAll={mutateAll} />
			<ConsultPatientModal ref={acceptPatientRef} mutateAll={mutateAll} />
			<PatientProfileModal
				pendingOrdersRef={pendingOrdersRef}
				ref={patientProfileRef}
				mutateAll={mutateAll}
			/>
			<PendingOrdersModal ref={pendingOrdersRef} />
		</AppLayout>
	);
};

export default DoctorPatientQueue;
