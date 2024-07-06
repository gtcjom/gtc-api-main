import React, { Fragment, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import Axios from '../../libs/axios';
import { Dialog, Transition } from '@headlessui/react';
import TextInputField from '../inputs/TextInputField';
import ReactSelectInputField from '../inputs/ReactSelectInputField';
import ActionBtn from '../buttons/ActionBtn';


const inputFields = [
	{
		label: "Medication Name",
		name: "medication_name",
		placeholder: "",
		className: "lg:col-span-4",
		type: "text",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
	{
		label: "Dosage",
		name: "dosage",
		placeholder: "",
		className: "lg:col-span-4",
		type: "text",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
	{
		label: "Frequency",
		name: "frequency",
		placeholder: "",
		className: "lg:col-span-4",
		type: "text",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
	{
		label: "Route",
		name: "route",
		placeholder: "",
		className: "lg:col-span-4",
		type: "text",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
	{
		label: "Start Date",
		name: "start_date",
		placeholder: "Select Start Date",
		className: "lg:col-span-4",
		type: "date",
		required: {
			value: true,
			message: "This field is required.",
		},
	},

	{
		label: "End Date",
		name: "end_date",
		placeholder: "Select End Date",
		className: "lg:col-span-4",
		type: "date",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
	{
		label: "Notes",
		name: "notes",
		placeholder: "",
		className: "lg:col-span-4",
		type: "textarea",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
	{
		label: "Instructions",
		name: "instructions",
		placeholder: "",
		className: "lg:col-span-4",
		type: "textarea",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
	{
		label: "Prescribing Physician",
		name: "prescribing_physician",
		placeholder: "",
		className: "lg:col-span-4",
		type: "text",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
	{
		label: "Diagnosis",
		name: "diagnosis",
		placeholder: "",
		className: "lg:col-span-4",
		type: "text",
		required: {
			value: true,
			message: "This field is required.",
		},
	},
];

const UpdateOutPatientTreatmentModal = (props, ref) => {
    const { logout, onSuccess } = props;
	const { user } = useAuth();
	const {
		register,
		getValues,
		setValue,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [mount, setMount] = useState(0);
	const [appointment, setAppointment] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	// const [vitals, setVitals] = useState(null);
    const [treatment, setTreatment] = useState(null);
	const [loading, setLoading] = useState(false);
	const [patient, setPatient] = useState(null);
	const [medicationName, setMedicationName] = useState("");
	
useEffect(() => {
	let t = setTimeout(() => {
		setMount(1);
	}, 400);
	return () => {
		clearTimeout(t);
	};
}, []);
useImperativeHandle(ref, () => ({
	show: show,
	hide: hide,
}));

const show = (data, appointmentData) => {
	setModalOpen(true);
	setPatient(data);

	setAppointment(appointmentData);
	getPatientTreatment(data);
};
const hide = () => {
	setModalOpen(false);
};

const submit = (data) => {
	console.log("dataaaa", treatment, data);
	setLoading(true);
	let formData = new FormData();
	formData.append("patient_id", patient?.id);

	formData.append("medication_name", data?.medication_name);
	formData.append("dosage", data?.dosage);
	formData.append("frequency", data?.frequency);
	formData.append("route", data?.route);
	formData.append("start_date", data?.start_date);
	formData.append("end_date", data?.end_date);
	formData.append("notes", data?.notes);
	formData.append("instructions", data?.instructions);
	formData.append("prescribing_physician", data?.prescribing_physician);
	formData.append("diagnosis", data?.diagnosis);
	formData.append("added_by_id", user?.id);

	let last_treatment_id = treatment?.data?.id || 0;
	let url = `v1/patient-treatment/store`;

	if (appointment?.id) {
		formData.append("appointment_id", appointment?.id);
	}
	if (last_treatment_id) {
		// formData.append("_method", "PATCH");
	}
	Axios.post(url, formData)
		.then((res) => {
			// addToList(data);
			if (onSuccess) onSuccess();
			setTimeout(() => {
				setLoading(false);
				// onSucce ss();
				if (onSuccess) onSuccess();
				toast.success("Treatment updated successfully!");
			}, 400);
			hide();
		})
		.finally(() => {
			setLoading(false);
		});
};

const getPatientTreatment = (patientData) => {
	Axios.get(`v1/patient-treatment/treatment/${patientData?.id}`).then(
		(res) => {
			setTreatment(res.data.data || []);
			console.log("ressss", res.data);
			let _treatment = res.data.data;
			if (_treatment) {
				console.log("ressss _treatment", _treatment);
				// setMedicationName(_treatment?.medication_name);
				setValue("medication_name", _treatment?.medication_name);
				setValue("dosage", _treatment?.dosage);
				setValue("frequency", _treatment?.frequency);
				setValue("route", _treatment?.route);
				setValue("start_date", _treatment?.start_date);
				setValue("end_date", _treatment?.end_date);
				setValue("notes", _treatment?.notes);
				setValue("instructions", _treatment?.instructions);
				setValue("prescribing_physician", _treatment?.prescribing_physician);
				setValue("diagnosis", _treatment?.diagnosis);
				Object.keys(_treatment).forEach((key) => {
					setValue(key, _treatment[key]);
				});
				
			}
		}
	);
};
return (
	<Transition appear show={modalOpen} as={Fragment}>
		<Dialog as="div" className="" onClose={hide}>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur z-20" />
			</Transition.Child>

			<div className="fixed inset-0 overflow-y-auto !z-[100]">
				<div className="flex min-h-full items-center justify-center p-4 text-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<Dialog.Panel className="w-full lg:max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
							<div className="flex flex-col pt-5 px-4 border-b p-4">
								<span className="text-xl font-bold  text-blue-900">
									Patient Treatment Form
								</span>
								<span className="text-sm font-light text-blue-900 ">
									Update patient treatment
								</span>
							</div>
							<div className="pb-4 flex flex-col gap-y-4 relative">
								<div className="grid grid-cols-1 lg:grid-cols-12 p-4 gap-4">
									{inputFields?.map((data) => {
										if (data?.name === "medication_name") {
											return (
												<TextInputField
													type={"text"}
													inputClassName={`${treatment?.medication_name?.color || ""}`}
													className={`${data?.className} lg:!w-full ${treatment?.medication_name?.color || ""}`}
													label={<>Medication Name</>}
													value={`${treatment?.medication_name?.result || ""}`}
													placeholder={data?.placeholder}
													error={errors[data?.name]?.message}
													helperText={""}
													{...register("medication_name", {
														required: data?.required || true,
													})}
												/>
											);
										} else {
											return (
												<TextInputField
													type={data?.type}
													className={`${data?.className} lg:!w-full`}
													label={<>{data?.label}:{""}</>}
													placeholder={data?.placeholder}
													options={data?.options}
													error={errors[data?.name]?.message}
													helperText={""}
													{...register(data?.name, {
														required: data?.required || false,
													})}
												/>
											);
										}
									})}
								</div>
							</div>  
							<div className="px-4 py-2 flex items-center justify-end bg-slate-100 border-t">
								<ActionBtn
									// type="danger"
									className="ml-4"
									onClick={handleSubmit(submit)}
								>
									Submit
								</ActionBtn>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</div>
		</Dialog>
	</Transition>
	);	
}

export default forwardRef(UpdateOutPatientTreatmentModal);