/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import FlatIcon from "../../components/FlatIcon";
import Img from "../../components/Img";
import PatientAppointments from "../../components/PatientAppointments";
import PatientPrescriptions from "../../components/PatientPrescriptions";
import PatientProfileDetails from "../../components/PatientProfileDetails";
import PatientVitals from "../../components/PatientVitals";
import TabGroup from "../../components/TabGroup";
import MenuTitle from "../../components/buttons/MenuTitle";
import { calculateAge, formatDate, patientFullName } from "../../libs/helpers";
import CreateAppointmentsModal from "./components/CreateAppointmentsModal";
import ActionBtn from "../../components/buttons/ActionBtn";
import PrivacyPolicyModal from "../../components/modal/PrivacyPolicyModal";
import PatientVitalCharts from "../../components/PatientVitalCharts";
import { useAuth } from "../../hooks/useAuth";
import AppointmentChoiceModal from "./components/AppointmentChoiceModal";
import NewAppointmentModal from "../../components/modal/NewAppointmentModal";
import PatientChartsAnesthesia from "../department/his-anesthesia/components/PatientChartsAnesthesia";
import LaboratoryResult from "../department/his-anesthesia/components/LaboratoryResult";
import ImagingResult from "../department/his-anesthesia/components/ImagingResult";
import AddPatientOperation from "../department/his-anesthesia/components/modal/AddPatientOperation";
import ProcedureChoiceModal from "../department/his-anesthesia/components/modal/ProcedureChoiceModal";
import AddPatientForDeliveryModal from "../department/his-anesthesia/components/modal/AddPatientForDeliveryModal";
import PatientCSROrder from "../department/his-nurse/components/PatientCSROrder";
import PatientPharmacyOrder from "../department/his-nurse/components/PatientPharmacyOrder";
import AddEmergencyCareModal from "../hims/his-er/modal/AddEmergencyCareModal";
// import ReferToRHUModal from "./components/ReferToRHUModal";

const PatientProfile = (props) => {
	const { patient, appointment } = props;
	const { checkUserType } = useAuth();
	const createAppointmentRef = useRef(null);
	const privacyRef = useRef(null);
	const referToRHURef = useRef(null);
	const appointmentChoiceRef = useRef(null);
	const ERCareChoiceRef = useRef(null);
	const bookTeleMedicineRef = useRef(null);
	const operationProcedureRef = useRef(null);
	const operationDeliveryRef = useRef(null);
	const procedureChoiceRef = useRef(null);
	const [patientSelfie, setPatientSelfie] = useState(null);

	return (
		<div className="flex flex-col">
			<div className="flex flex-col lg:flex-row gap-4 items-center px-4 pt-4 border-b justify- md:justify-start bg-slate-50 p-4 h-full">
				<div className="group relative h-[108px] w-[108px] min-h-[108px] min-w-[108px] rounded-full aspect-square bg-background">
					<Img
						type="user"
						name={`${patient?.lastname}-${patient?.firstname}-${patient?.middle}`}
						src={patient?.avatar || ""}
						className="min-h-[108px] min-w-[108px] aspect-square object-cover rounded-full"
						alt=""
						id="user-image-sample"
						key={`key-${patient?.id}-${patient?.avatar}`}
					/>
				</div>
				<div className="flex flex-col pl-4">
					<h6
						className={`text-left text-2xl mb-1 font-semibold flex items-center ${
							String(patient?.gender).toLowerCase() == "male"
								? "text-blue-800"
								: "text-pink-800"
						} mb-0`}
					>
						{patientFullName(patient)}
					</h6>
					<div className="flex gap-6 mb-2">
						<div className="flex items-center gap-2 text-base">
							<FlatIcon
								icon="rr-calendar-clock"
								className="text-base"
							/>
							<span>
								{calculateAge(patient?.birthday)} yrs. old
							</span>
						</div>
						<div className="flex items-center gap-2 text-base">
							<FlatIcon
								icon="rr-calendar"
								className="text-base"
							/>
							<span>{formatDate(patient?.birthday)}</span>
						</div>
					</div>
					<div className="flex gap-4 mb-2">
						<div className="flex items-center gap-2 text-base">
							<FlatIcon
								icon="rr-venus-mars"
								className="text-base"
							/>
							{String(patient?.gender).toLowerCase() == "male" ? (
								<span className="text-blue-700">Male</span>
							) : (
								<span className="text-pink-700">Female</span>
							)}
						</div>
					</div>
				</div>
				{checkUserType("NURSE")? (
					<ActionBtn
						type="secondary"
						className="ml-auto h-14 !rounded-[30px] font-medium gap-2 px-4"
						onClick={() => {
							appointmentChoiceRef.current.show();
							//privacyRef.current.show({ patient: patient });
						}}
					>
						<FlatIcon icon="bs-add-folder" />
						Create Appointment
					</ActionBtn>
				) : (
					""
				)}
				{checkUserType("ER") ? (
					<ActionBtn
						type="secondary"
						className="ml-auto h-12 !rounded-[30px] font-medium gap-2 px-4"
						onClick={() => {
							// ERCareChoiceRef.current.show();
							createAppointmentRef.current.show(patient.id);
							// privacyRef.current.show({ patient: patient });
						}}
					>
						<FlatIcon icon="bs-add" />
						EMERGENCY APPOINTMENT
					</ActionBtn>
				) : (
					""
				)}
				{checkUserType("ANESTHESIA") ? (
					<ActionBtn
						type="secondary"
						className="ml-auto h-14 !rounded-[30px] font-medium gap-2 px-4"
						onClick={() => {
							procedureChoiceRef.current.show();
						}}
					>
						<FlatIcon icon="bs-add-folder" />
						Create Operation
					</ActionBtn>
					// <ActionBtn
					// 	type="secondary"
					// 	className="ml-auto h-14 !rounded-[30px] font-medium gap-2 px-4"
					// 	onClick={() => {
					// 		operationProcedureRef.current.show(
					// 			patient,
					// 			appointment,
					// 		);
					// 		//privacyRef.current.show({ patient: patient });
					// 	console.log("patient id::", patient);
					// 	}}
					// >
					// 	<FlatIcon icon="rr-add" />
					// 	Create Operation Procedure
					// </ActionBtn>

				) : (
					""
				)}
			</div>
			<div>
				{checkUserType("ANESTHESIA")? (
				<TabGroup
					tabClassName={`py-3 bg-slate-100 border-b`}
					contents={[
						{
							title: (
								<MenuTitle src="/profile.png">
									Profile
								</MenuTitle>
							),

							content: (
								<PatientProfileDetails patient={patient} />
							),
						},

						{
							title: (
								<MenuTitle src="/patient.png">
									Appointments
								</MenuTitle>
							),
							content: <PatientAppointments patient={patient} />,
						},
						{
							title: (
								<MenuTitle src="/vitals/chart.png">
									Charts
								</MenuTitle>
							),

							content: <PatientChartsAnesthesia patient={patient} />,
						},
						{
							title: (
								<MenuTitle src="/vitals/vitals.png">
									Vital signs
								</MenuTitle>
							),

							content: <PatientVitals patient={patient} />,
						},

						{
							title: (
								<MenuTitle src="/laboratory.png">
									Laboratory
								</MenuTitle>
							),

							content: <LaboratoryResult patient={patient} />,
						},
						{
							title: (
								<MenuTitle src="/ultrasound.png">
									Imaging
								</MenuTitle>
							),

							content: <ImagingResult patient={patient} />,
						},
						{
							title: (
								<MenuTitle src="/vitals/prescription.png">
									CSR
								</MenuTitle>
							),
							content: <PatientCSROrder patient={patient}/>,
						},
						{
							title: (
								<MenuTitle src="/vitals/prescription.png">
									Pharmacy
								</MenuTitle>
							),
							content: <PatientPharmacyOrder patient={patient}/>,
						},
					]}
				/>
				) : (
					<TabGroup
					tabClassName={`py-3 bg-slate-100 border-b`}
					contents={[
						{
							title: (
								<MenuTitle src="/profile.png">
									Profile
								</MenuTitle>
							),

							content: (
								<PatientProfileDetails patient={patient} />
							),
						},

						{
							title: (
								<MenuTitle src="/patient.png">
									Appointments
								</MenuTitle>
							),
							content: <PatientAppointments patient={patient} />,
						},
						
						{
							title: (
								<MenuTitle src="/vitals/vitals.png">
									Vital Charts
								</MenuTitle>
							),

							content: <PatientVitalCharts patient={patient} />,
						},
						// checkUserType("NURSE") && {
						// 	title: (
						// 		<MenuTitle src="/vitals/prescription.png">
						// 			CSR & Pharmacy
						// 		</MenuTitle>
						// 	),
						// 	content: <CsrPharmacyOrder patient={patient} />,
						// }

						
					]}
				/>
				)}
				
			</div>
			<CreateAppointmentsModal
				referToRHURef={referToRHURef}
				ref={createAppointmentRef}
				patientSelfie={patientSelfie}
				setPatientSelfie={setPatientSelfie}
			/>

			<AddPatientOperation
				patient={patient}
				ref={operationProcedureRef}	
				// onSuccess={() => {
				// 	reloadData();
				// }}
			/>
			<AddPatientForDeliveryModal
				patient={patient}
				ref={operationDeliveryRef}	
				// onSuccess={() => {
				// 	reloadData();
				// }}
			/>

			<ProcedureChoiceModal 
			ref={procedureChoiceRef}
			onClickSurgery={() => {
				operationProcedureRef.current.show({
				patient,
				appointment,
			});
			}}
			onClickDelivery={() => {
				operationDeliveryRef.current.show({
				patient,
				appointment,
			});
			}}
				
			/>
			<AddEmergencyCareModal ref={ERCareChoiceRef}/> 

			<PrivacyPolicyModal
				ref={privacyRef}
				onSuccess={(data) => {
					createAppointmentRef.current.show({ patient });
				}}
				patientSelfie={patientSelfie}
				setPatientSelfie={setPatientSelfie}
			/>
			<AppointmentChoiceModal
				ref={appointmentChoiceRef}
				onClickConsult={() => {
					privacyRef.current.show({ patient: patient });
				}}
				onClickAhef={() => {}}
				onClickTelemedicine={() => {
					bookTeleMedicineRef.current.show();
				}}
			/>
			<NewAppointmentModal
				ref={bookTeleMedicineRef}
				onClickConsult={() => {
					privacyRef.current.show({ patient: patient });
				}}
				onClickAhef={() => {}}
				onClickTelemedicine={() => {
					bookTeleMedicineRef.current.show();
				}}
			/>
			{/* <ReferToRHUModal 
				ref={referToRHURef}
				// onSuccess={onSuccess}
				patientSelfie={patientSelfie}
				patient={patient}
			/> */}
		</div>
	);
};

export default PatientProfile;
