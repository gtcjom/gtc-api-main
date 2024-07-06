import { useForm } from "react-hook-form";
import CollapseDiv from "../../../components/CollapseDiv";
import FlatIcon from "../../../components/FlatIcon";
import PatientVitals from "../../../components/PatientVitals";
import {
	generalHistories,
	medicalSurgicalHistories,
	symptoms,
} from "../../../libs/appointmentOptions";
import { formatDateMMDDYYYYHHIIA, keyByValue } from "../../../libs/helpers";
import useNoBugUseEffect from "../../../hooks/useNoBugUseEffect";
import TextInputField from "../../../components/inputs/TextInputField";
import ICUNursePatientServices from "../../../components/modal/ICUNursePatientServices";
import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import Axios from "../../../libs/axios";
import AppointmentStatus from "../../../components/AppointmentStatus";
import CashierApproval from "../../appointments/components/CashierApproval";

const uniq_id = uuidv4();
/* eslint-disable react/prop-types */
const InfoText = ({
	className = "",
	valueClassName = "",
	label,
	icon,
	value,
}) => {
	return (
		<div className={`flex flex-col ${className}`}>
			{label ? (
				<span className="text-slate-800 text-xs capitalize mb-1">
					{label}
				</span>
			) : (
				""
			)}
			<div className="flex items-center mb-0 gap-2">
				<span className="flex items-center justify-center">
					<FlatIcon
						icon={icon || "bs-arrow-turn-down-right"}
						className="text-[10px] text-slate-600 ml-1"
					/>
				</span>
				<span
					className={`capitalize gap-1 text-slate-900 flex text-base flex-wrap ${valueClassName} `}
				>
					{value}
				</span>
			</div>
		</div>
	);
};
const AppointmentDetailsForNurse = ({
	appointment: propAppointment,
	forCashier = false,
	setOrder,
	hideServices = false,
	mutateAll,
	userRole,
}) => {
	const {
		register,
		getValues,
		setValue,
		control,
		reset,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [appointment, setAppointment] = useState(propAppointment);
	const [key, setKey] = useState(uniq_id);
	useNoBugUseEffect({
		functions: () => {
			setTimeout(() => {
				if (appointment?.social_history) {
					Object.keys(appointment?.social_history).map((key) => {
						console.log(
							"appointment?.social_history[key]",
							key,
							appointment?.social_history[key]
						);
						setValue(key, appointment?.social_history[key]);
					});
				}
			}, 1500);
		},
		params: [appointment?.id, key],
	});
	const appointmentStatus = () => {
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
		if (appointment?.status == "pending-for-bhw-release") {
			return <span className="text-red-600">Pending for release</span>;
		}
		return (
			<span className="text-red-600 uppercase">
				{String(appointment?.status).replaceAll("-", " ")}
			</span>
		);
	};
	const refreshData = () => {
		Axios.get(`v1/clinic/get-appointment/${appointment?.id}`).then(
			(res) => {
				setAppointment(res.data.data);
				setKey(uuidv4());
			}
		);
	};
	return (
		<div className="flex flex-col">
			
			{appointment?.id ? (
				<>
					<div className="flex flex-col gap-y-4 px-4 border-x border-b rounded-b-xl border-indigo-100 pt-5 pb-4">

						<CollapseDiv
							defaultOpen={
								appointment.status == "pending" &&
								appointment?.vital_id == null
							}
							withCaret={true}
							title="Patient Vitals"
							headerClassName="bg-blue-50"
							bodyClassName="p-0"
						>
							<PatientVitals
								showTitle={false}
								appointment={appointment}
								patient={appointment?.patient}
								mutateAll={mutateAll}
								onSuccess={() => {
									refreshData();
								}}
							/>
						</CollapseDiv>
						{appointment?.post_notes == "Tuberculosis" &&
						appointment.tb_symptoms != null ? (
							<CollapseDiv
								defaultOpen={
									appointment?.post_notes == "Tuberculosis" &&
									appointment.tb_symptoms != null
								}
								withCaret={true}
								title="Patient TB Symtoms"
								headerClassName="bg-blue-50"
								bodyClassName="p-0"
							>
								{appointment?.tb_symptoms != null ? (
									<div className="flex flex-col gap-1 mt-0 pb-2 !shadow-yellow-600 rounded-sm bg-white">
										<ul className="w-1/2">
											{symptoms?.map((symp) => {
												return (
													<li
														className="!text-xs flex justify-between"
														key={`${keyByValue(
															symp.label
														)}`}
													>
														<span>
															{symp.label} -{" "}
														</span>
														<b className="text-center">
															{appointment
																?.tb_symptoms[
																symp.value
															]
																? "YES"
																: "no "}
														</b>
													</li>
												);
											})}
										</ul>
									</div>
								) : (
									""
								)}
							</CollapseDiv>
						) : (
							""
						)}

						{!hideServices ? (
							<CollapseDiv
								defaultOpen={
									(appointment.status == "pending" &&
										appointment?.vital_id != null) ||
									appointment?.status ==
										"pending-for-bhw-release"
								}
								withCaret={true}
								title="Services"
								headerClassName="bg-blue-50"
								bodyClassName="p-0"
							>
								{forCashier ? (
									<CashierApproval
										setAppointment={setOrder}
										showTitle={false}
										appointment={appointment}
										patient={appointment?.patient}
										mutateAll={mutateAll}
									/>
								) : (
									<ICUNursePatientServices
										setAppointment={setOrder}
										showTitle={false}
										mutateAll={mutateAll}
										appointment={appointment}
										patient={appointment?.patient}
									/>
								)}
							</CollapseDiv>
						) : (
							""
						)}
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default AppointmentDetailsForNurse;
