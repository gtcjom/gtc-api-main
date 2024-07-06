/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import FlatIcon from "../FlatIcon";
import ActionBtn from "../buttons/ActionBtn";
import useNoBugUseEffect from "../../hooks/useNoBugUseEffect";

import { v4 as uuidv4 } from "uuid";
import Axios from "../../libs/axios";
import ReactSelectInputField from "../inputs/ReactSelectInputField";
import TextInputField from "../inputs/TextInputField";
import {
	dataURItoBlob,
	dateYYYYMMDD,
	doctorName,
	doctorSpecialty,
	patientFullName,
} from "../../libs/helpers";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { Controller, set, useForm } from "react-hook-form";
import ReactQuillField from "../inputs/ReactQuillField";
import ImagePicker from "../inputs/ImagePicker";
import ContentTitle from "../buttons/ContentTitle";
import InfoText from "../InfoText";
import ReleaseMedStep1 from "../../pages/appointments/components/ReleaseMedStep1";
import ReleaseMedStep2 from "../../pages/appointments/components/ReleaseMedStep2";
import ReleaseMedStep3 from "../../pages/appointments/components/ReleaseMedStep3";
import { mutate } from "swr";
import Pagination from "../table/Pagination";
import Table from "../table/Table";
import useDataTable from "../../hooks/useDataTable";
import UploadCSROrderModal from "../../pages/department/his-nurse/components/modal/UploadCSROrderModal";
import UploadPharmacyOrderModal from "../../pages/department/his-nurse/components/modal/UploadPharmacyOrderModal";
import UpdatePatientVitalsModal from "./UpdatePatientVitalsModal";
import TabGroup from "../TabGroup";
import MenuTitle from "../buttons/MenuTitle";
import PatientVitals from "../PatientVitals";

const uniq_id = uuidv4();

const Card = ({ title, children, icon, color }) => {
	return (
		<div className="shadow-sm rounded-xl flex items-center p-3 w-1/2 2xl:w-[calc(100%/3-24px)] border-[0.5px] border-blue-300">
			<div className="flex flex-col pb-3">
				<h3
					className="text-base font-bold text-gray-900 mb-0 text-opacity-75"
					style={{ color: color }}
				>
					{title}
				</h3>
				<div className="h-[3px] w-4/5 bg-blue-300 mb-[1px]" />
				<div className="h-[2px] w-2/5 bg-red-300 mb-3" />
				{children}
			</div>
			<div className="p-1 bg-white bg-opacity-5 rounded-xl ml-auto">
				<img
					src={`/vitals/${icon}.png`}
					className="w-10 object-contain"
				/>
			</div>
		</div>
	);
};

const ICUNurseQueue = ({ isICUNurse, loading, data, page, setPage, meta, paginate, setPaginate }) => {
	if (isICUNurse) {
	  return null;
	}
}

const PatientServices = (props) => {
	const [vitals, setVitals] = useState(false);
	const [update, setUpdate] = useState(false);
	const updateVitalRef = useRef(null);
	const {showTitle = true} = props;
	const { patient } = props;
	const csrFormRef = useRef(null);
	const pharmacyFormRef = useRef(null);
	const { appointment, setAppointment, mutateAll } = props;
	const { user } = useAuth();
	const {
		register,
		getValues,
		watch,
		control,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const {
        page,
        setPage,
        meta,
        setMeta,
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
        reloadData,
    } = useDataTable({
        url: `/v1/anesthesia/patient-csr/patient/${patient?.id}`,
    });

	useNoBugUseEffect({
		functions: () => {
			getItems();
			getHUList("RHU");
		},
		params: [appointment?.id],
	});

	const [step, setStep] = useState(1);
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [imageCaptured, setImageCaptured] = useState(null);
	const [isPositive, setIsPositive] = useState(false);
	const [isSelectorLoading, setIsSelectorLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [itemUsed, setItemUsed] = useState(false);
	const [forConfirmation, setForConfirmation] = useState(false);
	const [doctorList, setDoctorList] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [satisfaction, setStatisfaction] = useState(null);

	useNoBugUseEffect({
		functions: () => {
			if (getValues("rhu_id")) {
				getDoctors();
			}
		},
		params: [watch("rhu_id")],
	});

	useNoBugUseEffect({
		functions: () => {
			if (user?.health_unit_id) {
				setValue("rhu_id", user?.health_unit_id);
			}
		},
		params: [user?.health_unit_id],
	});
	const getDoctors = () => {
		Axios.get(
			`v1/clinic/doctors-by-location?health_unit_id=${getValues(
				"rhu_id"
			)}`
		).then((res) => {
			setDoctorList(res.data.data);
		});
	};
	const getItems = () => {
		Axios.get(`v1/item-inventory?location_id=${user?.health_unit_id}`).then(
			(res) => {
				setItems(res.data.data);
			}
		);
	};
	const addNewSelectedItem = () => {
		setSelectedItems((prevItems) => [
			...prevItems,
			{
				id: uuidv4(),
				item: null,
				quantity: 0,
			},
		]);
	};
	const removeSelectedItem = (id) => {
		setSelectedItems((prevItems) =>
			prevItems.filter((item) => item.id != id)
		);
	};
	const updateItemInSelected = (id, itemData) => {
		setSelectedItems((items) =>
			items.map((item) => {
				if (item.id == id) {
					return {
						...item,
						item: itemData,
					};
				}
				return item;
			})
		);
	};
	const updateItemQty = (id, qty) => {
		setSelectedItems((items) =>
			items.map((item) => {
				if (item.id == id) {
					return {
						...item,
						quantity: qty,
					};
				}
				return item;
			})
		);
	};
	const useItems = () => {
		console.log("itemsssss", items);
		if (selectedItems?.length == 0) {
			toast.warning("Please select item(s) to continue...", {
				position: "bottom-right",
			});
			return;
		} else if (selectedItems[0]?.item == null) {
			toast.warning("Please select item(s) to continue...", {
				position: "bottom-center",
			});
			return;
		}

		// items.map()
		///v1/doctor/laboratory-order/store
		const formData = new FormData();
		formData.append("order_date", dateYYYYMMDD());
		formData.append("patient_id", appointment?.patient?.id);
		formData.append("appointment_id", appointment?.id);
		formData.append("health_unit_id", user?.health_unit_id);

		formData.append(
			"laboratory_test_type",
			String(appointment?.post_notes).toLowerCase()
		);
		formData.append("notes", String(appointment?.post_notes).toLowerCase());
		formData.append("_method", "PATCH");
		selectedItems.map((x) => {
			formData.append("inventory_id[]", x.id);
			formData.append("items[]", x.item?.item?.id);
			formData.append("quantity[]", x.quantity || 1);
		});
		Axios.post(`/v1/clinic/tb-lab-service/${appointment?.id}`, formData)
			.then((res) => {
				setItemUsed(true);
				toast.success("Success! item used successfully!");
				// setRefreshKey((x) => x + 1);
			})
			.catch(() => {
				toast.error("Something went wrong!");
			});
	};

	const sendToDoctor = (data) => {
		setLoading(true);
		let formdata = new FormData();
		formdata.append("rhu_id", data?.rhu_id);
		formdata.append("doctor_id", data?.doctor_id);
		formdata.append("_method", "PATCH");

		Axios.post(`v1/clinic/tb-assign-to-doctor/${appointment?.id}`, formdata)
			.then((response) => {
				let data = response.data;
				// console.log(data);
				setTimeout(() => {
					setAppointment(null);
				}, 100);
				setTimeout(() => {
					toast.success("Patient referral success!");
					setLoading(false);
				}, 200);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	const hasError = (name) => {
		return errors[name]?.message;
	};
	const [HUList, setHUList] = useState([]);
	useNoBugUseEffect({
		functions: () => {
			setTimeout(() => {
				setValue("location_type", user?.healthUnit?.type);
				setValue("health_unit_id", user?.health_unit_id);
			}, 200);
		},
		params: [user?.id],
	});

	const getHUList = (type) => {
		Axios.get(`v1/health-unit/list?type=${type}`)
			.then((res) => {
				setHUList(res.data.data);
			})
			.finally(() => {
				setIsSelectorLoading(false);
			});
	};
	const releasePrescription = (data) => {
		// setLoading(true);
		// console.log("prescriptionItems", prescriptionItems);
		let formData = new FormData();
		// formData.append("appointment_id", appointment_id);
		formData.append("_method", "PATCH");
		appointment?.prescriptions.map((data) => {
			formData.append("inventory_id[]", data.inventory_id);
			formData.append("quantity[]", data.quantity);
			formData.append("items[]", data?.item?.id);
			formData.append("sig[]", data?.sig);
			formData.append("details[]", "medicine released");
		});
		Axios.post(
			`/v1/clinic/tb-released-medicine/${appointment?.id}`,
			formData
		)
			.then((res) => {
				setStep(2);
				toast.success("Prescription released!");
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const submitSatisfaction = () => {
		const formData = new FormData();
		formData.append("_method", "PATCH");
		formData.append("satisfaction", satisfaction);
		Axios.post(
			`/v1/clinic/tb-satisfaction-rate/${appointment?.id}`,
			formData
		)
			.then((res) => {
				// addToList(data);
				// setTimeout(() => {
				// setLoading(false);
				setStep(3);
				toast.success("Satisfaction successfully submitted!");
				// }, 400);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const submitSelfie = () => {
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
			// onUploadProgress: progressEvent => onProgress(progressEvent),
		};
		const formData = new FormData();
		const file = dataURItoBlob(imageCaptured);
		formData.append("_method", "PATCH");
		formData.append("selfie", file);
		Axios.post(
			`/v1/clinic/tb-selfie/${appointment?.id}`,
			formData,
			config
		).then((res) => {
			setTimeout(() => {
				setAppointment(null);
				if (mutateAll) mutateAll();
			}, 100);
			setTimeout(() => {
				toast.success("Selfie successfully submitted!");
				setStep(1);
				setAppointment(null);
			}, 300);
		});
	};
	return (
		<div className="flex flex-col items-start">
			{appointment?.status == "pending-for-rhu-release" ? (
				<>
					<div className="flex items-center w-full justify-center px-4 pb-4 gap-4">
						<div
							className={`h-14 w-1/4 rounded-lg bg-slate-200 flex items-center justify-center  flex-col duration-200 ${
								step == 1
									? "opacity-100 !bg-green-100"
									: "opacity-50"
							}`}
						>
							<b className="text-sm">Step 1</b>
							<span className="text-xs">
								Release medicine form
							</span>
						</div>
						<div
							className={`h-14 w-1/4 rounded-lg bg-slate-200 flex items-center justify-center  flex-col duration-200 ${
								step == 2
									? "opacity-100 !bg-green-100"
									: "opacity-50"
							}`}
						>
							<b className="text-sm">Step 2</b>
							<span className="text-xs">Satisfaction Rating</span>
						</div>
						<div
							className={`h-14 w-1/4 rounded-lg bg-slate-200 flex items-center justify-center  flex-col duration-200 ${
								step == 3
									? "opacity-100 !bg-green-100"
									: "opacity-50"
							}`}
						>
							<b className="text-sm">Step 3</b>
							<span className="text-xs">
								Proof of Patient and Personnel
							</span>
						</div>
					</div>
					<div className="p-5 mx-auto w-4/5 border rounded-xl">
						{step == 1 ? (
							<ReleaseMedStep1
								loading={loading}
								setLoading={setLoading}
								appointment={appointment}
								releasePrescription={releasePrescription}
							/>
						) : (
							""
						)}
						{step == 2 ? (
							<ReleaseMedStep2
								loading={loading}
								setLoading={setLoading}
								appointment={appointment}
								satisfaction={satisfaction}
								setStatisfaction={setStatisfaction}
								submitSatisfaction={submitSatisfaction}
							/>
						) : (
							""
						)}
						{step == 3 ? (
							<ReleaseMedStep3
								imageCaptured={imageCaptured}
								setImageCaptured={setImageCaptured}
								loading={loading}
								setLoading={setLoading}
								appointment={appointment}
								submitSelfie={submitSelfie}
							/>
						) : (
							""
						)}
					</div>
				</>
			) : (
				<div className="flex flex-col w-full gap-4 pb-2">
					<div className="p-0 flex flex-col gap-y-4 relative w-full">
						<h4 className="text-md text-indigo-800 border-b border-b-indigo-600 pb-1 font-bold mb-0">
							Send patient to Doctor
						</h4>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<Controller
								name="rhu_id"
								control={control}
								rules={{
									required: {
										value: true,
										message: "This field is required",
									},
								}}
								render={({
									field: {
										onChange,
										onBlur,
										value,
										name,
										ref,
									},
									fieldState: {
										invalid,
										isTouched,
										isDirty,
										error,
									},
								}) => (
									<ReactSelectInputField
										isClearable={false}
										label="Select RHU"
										className="pointer-events-none"
										isLoading={isSelectorLoading}
										onChangeGetData={(data) => {}}
										inputClassName=" "
										ref={ref}
										value={value}
										onChange={onChange}
										onData
										readOnly
										onBlur={onBlur} // notify when input is touched
										error={error?.message}
										placeholder={`Select Health Unit`}
										options={HUList?.map((unit) => ({
											label: unit?.name,
											value: unit?.id,
											rooms: unit?.rooms,
										}))}
									/>
								)}
							/>{" "}
							<Controller
								name="doctor_id"
								control={control}
								rules={{
									required: {
										value: true,
										message: "This field is required",
									},
								}}
								render={({
									field: {
										onChange,
										onBlur,
										value,
										name,
										ref,
									},
									fieldState: {
										invalid,
										isTouched,
										isDirty,
										error,
									},
								}) => (
									<ReactSelectInputField
										isClearable={true}
										label="Select Doctor"
										isLoading={isSelectorLoading}
										onChangeGetData={(data) => {}}
										inputClassName=" "
										ref={ref}
										value={value}
										onChange={onChange}
										onData
										onBlur={onBlur} // notify when input is touched
										error={error?.message}
										placeholder={`Select Health Unit`}
										options={doctorList?.map((doctor) => ({
											label: `${doctorName(doctor)}`,
											value: doctor?.id,
											descriptionClassName:
												" !opacity-100",
											description: (
												<div className="flex text-xs flex-col gap-1">
													<span>
														{doctorSpecialty(
															doctor
														)}
													</span>
													<span className="flex items-center gap-1">
														Status:
														<span className="text-green-900 drop-shadow-[0px_0px_1px_#ffffff] text-xs font-bold">
															ONLINE
														</span>
													</span>
												</div>
											),
										}))}
									/>
								)}
							/>
							{/* Date input field */}
							<Controller
							name="operation_date"
							control={control}
							rules={{
								required: {
									value: true,
									message: "This field is required",
								},
							}}
							render={({
								field: { onChange, onBlur, value, ref },
								fieldState: { error },
							}) => (
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600">
                                    Operation Date
                                </label>
                                <input
                                    type="date"
                                    className="input"
                                    ref={ref}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                                {error && <span className="text-red-500 text-sm">{error.message}</span>}
                            </div>
                        )}
                    />
                    {/* Time input field */}
                    <Controller
                        name="operation_time"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: "This field is required",
                            },
                        }}
                        render={({
                            field: { onChange, onBlur, value, ref },
                            fieldState: { error },
                        }) => (
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600">
                                    Operation Time
                                </label>
                                <input
                                    type="time"
                                    className="input"
                                    ref={ref}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                                {error && <span className="text-red-500 text-sm">{error.message}</span>}
                            </div>
                        )}
                    />
						</div>
						<Controller
							name="procedure"
							control={control}
							rules={{
								required: {
									value: true,
									message:
										"This field is required",
								},
							}}
							render={({
								field: {
									onChange,
									onBlur,
									value,
									name,
									ref,
								},
								fieldState: {
									invalid,
									isTouched,
									isDirty,
									error,
								},
							}) => (
								<ReactSelectInputField
									isClearable={false}
									label={
										<>
											Delivery Procedure
											<span className="text-danger ml-1">
												*
											</span>
										</>
									}
									inputClassName=" "
									ref={ref}
									value={value}
									onChange={onChange}
									onBlur={onBlur} // notify when input is touched
									error={error?.message}
									placeholder="Select Delivery Type"
									options={[
										// {
										// 	label: "Provincial Hospital (PH)",
										// 	value: "PH",
										// },
										{
											label: "Cesarean section",
											value: "Cesarean section",
										},
										
										// {
										// 	label: "Barangay Health Station (BHS)",
										// 	value: "BHS",
										// },
									]}
								/>
							)}
						/>
						
							<UpdatePatientVitalsModal
								ref={updateVitalRef}
								onSuccess={(data) => {
									console.log("onSuccess", getPatientVitals(patient));
									if (mutateAll) mutateAll();
									if (onSuccess) onSuccess(data);
								}}
							/>
						</div>

						{/* <div>
							<ContentTitle title="CSR" />
							<ActionBtn
								type="success"
								title="Add CSR"
								className="h-8 w-8 ml-auto !rounded-md mb-2"
								onClick={() => {
									csrFormRef.current.show(patient);
									console.log('patient CSR Modal Patient:', patient);
								}}
							>
								<FlatIcon icon="rr-plus" className="mt-1 text-xl" />
							</ActionBtn>
							<div className="flex flex-col items-start">
								<Table
									className={`pb-2`}
									loading={loading}
									columns={[
										{
											header: "Date",
											className: "text-left w-[150px]",
											tdClassName: "text-left",
											key: "date",
											cell: (data) => {
												return formatDateMMDDYYYY(new Date(data?.date));
											},
										},
										{
											header: "Supplies/Medicines",
											className: "text-left",
											tdClassName: "text-left",
											key: "inventory_csrs_id",
											cell: (data) => {
												return data?.relationships?.inventory_csrs_id?.csr_supplies;
											},
										},
										{
											header: "Doctor",
											className: "text-left",
											tdClassName: "text-left",
											key: "doctor_id",
											cell: (data) => {
												return (
													<div className="flex flex-col">
														<span className="font-medium text-black -mb-[4px]">
															{doctorName(data?.relationships?.doctor)}
														</span>
														<span className="text-[10px] font-light">
															{doctorSpecialty(data?.relationships?.doctor)}
														</span>
													</div>
												);
											},
										},
										{
											header: "Quantity",
											className: "text-center w-[100px]",
											tdClassName: "text-center",
											key: "quantity",
											cell: (data) => {
												return data?.quantity;
											},
										},
										// {
										//     header: "Status",
										//     className: "text-center w-[150px]",
										//     tdClassName: "text-center",
										//     key: "order_status",
										// },
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
							</div>
							<UploadCSROrderModal ref={csrFormRef} patient={patient} />
						</div> */}

						<div>
							<ContentTitle title="Pharmacy Order" />
							<ActionBtn
								type="success"
								title="Add Pharmacy"
								className="h-8 w-8 ml-auto !rounded-md mb-2"
								onClick={() => {
									pharmacyFormRef.current.show(patient);
									console.log('patient CSR Modal Patient:-------------------------------', patient)
								}}
							>
								<FlatIcon
									icon="rr-plus"
									className="mt-1 text-xl"
								/>
							</ActionBtn> 
							<div className="flex flex-col items-start">	
									<Table
										className={`pb-2`}
										loading={loading}
										columns={[
											{
												header: "Date",
												className: "text-left w-[150px]",
												tdClassName: "text-left",
												key: "date",
												cell: (data) => {
													return formatDateMMDDYYYY(
														new Date(data?.date)
													);
												},
											},
											{
												header: "Supplies/Medicines",
												className: "text-left",
												tdClassName: "text-left",
												key: "inventory_pharmacies_id",
												cell: (data) => {
															return data?.relationships?.inventory_pharmacies_id?.pharmacy_supplies;
														},
											},
											{
												header: "Doctor",
												className: "text-left",
												tdClassName: "text-left",
												key: "doctor_id",
												cell: (data) => {
													return (
														<div className="flex flex-col">
															<span className="font-medium text-black -mb-[4px]">
																{doctorName(
																	data?.relationships?.doctor
																)}
															</span>
															<span className="text-[10px] font-light">
																{doctorSpecialty(
																	data?.relationships?.doctor
																)}
															</span>
														</div>
													);
												},
											},
											{
												header: "Quantity",
												className: "text-center w-[100px] ",
												tdClassName: "text-center",
												key: "quantity",
												cell: (data) => {
															return data?.quantity;
														},
											},
											// {
											// 	header: "Status",
											// 	className: "text-center w-[150px] ",
											// 	tdClassName: "text-center",
											// 	key: "order_status",
											// 	// cell: (data) => {
											// 	// 	return <Status status={data?.order_status} />;
											// 	// },
											// },
											
											// {
											// 	header: "Delete",
											// 	className: `text-center ${isDoctor() ? "" : "hidden"}`,
											// 	tdClassName: `text-center ${
											// 		isDoctor() ? "" : "hidden"
											// 	}`,
											// 	key: "delete",
											// 	cell: (data) => {
											// 		return (
											// 			<div className="w-full flex items-center">
											// 				{/* {JSON.stringify(data)} */}
											// 				<ActionBtn
											// 					size="sm"
											// 					type="danger"
											// 					disabled={
											// 						data?.order_status ==
											// 						"for-result-reading"
											// 					}
											// 					className=" mx-auto"
											// 					onClick={() => {
											// 						deleteLabOrderRef.current.show(
											// 							data
											// 						);
											// 					}}
											// 				>
											// 					<FlatIcon icon="rr-trash" /> Delete
											// 				</ActionBtn>
											// 			</div>
											// 		);
											// 	},
											// },
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
								</div>
								
								<UploadPharmacyOrderModal ref={pharmacyFormRef} patient={patient}/>
							</div>

						<ActionBtn
							className="px-4 !rounded-2xl w-full"
							type="success"
							size="lg"
							loading={loading}
							onClick={handleSubmit(sendToDoctor)}
						>
							<FlatIcon
								icon="rr-check"
								className="mr-2 text-xl"
							/>
							Send patient to doctor
						</ActionBtn>
					</div>
			)}
		</div>
	);
};

export default PatientServices;
