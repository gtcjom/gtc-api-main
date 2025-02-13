import React, { Fragment, forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Axios from '../../../../../libs/axios';
import { toast } from 'react-toastify';
import ActionBtn from '../../../../../components/buttons/ActionBtn';
import TextInputField from '../../../../../components/inputs/TextInputField';
import ReactSelectInputField from '../../../../../components/inputs/ReactSelectInputField';
import FlatIcon from '../../../../../components/FlatIcon';
import { Dialog, Transition } from '@headlessui/react';
import { dataURItoBlob, dateYYYYMMDD } from '../../../../../libs/helpers';
import useNoBugUseEffect from '../../../../../hooks/useNoBugUseEffect';
import useLabQueue from '../../../../../hooks/useLabQueue';
import ReactQuillField from '../../../../../components/inputs/ReactQuillField';
import upload from "../../../../../assets/images/camera.png";
import ImagePicker from '../../../../../components/inputs/ImagePicker';

const UploadLaboratoryTest = (props, ref) => {
    const { patient, onSuccess } = props;
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

	const { pending } = useLabQueue();
	const [image, setImage] = useState(null);
	const [showData, setShowData] = useState(null);
	const [saving, setSaving] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	useNoBugUseEffect({
		functions: () => {},
	});
	useImperativeHandle(ref, () => ({
		show: show,
		hide: hide,
	}));

	const show = (data) => {
		console.log("patient", patient?.id);
		console.log("/v1/laboratory/tests/list");
		setShowData(data);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};
	const submit = (data) => {
		setSaving(true);
		let formData = new FormData();
		let config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};
		formData.append("_method", "PATCH");
		// formData.append("rhu_xray_result", data?.rhu_xray_result);
        formData.append("rhu_xray_remarks", data?.rhu_xray_remarks);
		console.log("imageimageimage", image);
		if (image) {
			formData.append("attachment", dataURItoBlob(image));
		}
		// return "";
		Axios.post(
			`v1/laboratory/upload-lab-result/${showData?.id}`,
			formData,
			config
		)
			.then((res) => {
				reset();
				toast.success("Laboratory result uploaded successfully!");
				onSuccess();
				hide();
			})
			.finally(() => {
				setTimeout(() => {
					setSaving(false);
				}, 1000);
			});
	};
	const hasError = (name) => {
		return errors[name]?.message;
	};
	const noHide = () => {};
  return (
    <Transition appear show={modalOpen} as={Fragment}>
			<Dialog as="div" className="" onClose={noHide}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur z-[300]" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto !z-[350]">
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
							<Dialog.Panel className="w-full lg:max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="div"
									className=" p-4 font-medium leading-6 flex flex-col items-start text-gray-900 bg-slate-50 border-b"
								>
									<span className="text-xl text-center font-bold  text-blue-900">
										Upload Laboratory Result
									</span>
								</Dialog.Title>
								<div className="p-6 flex flex-col gap-y-4 relative">
									{/* <div className="border-b">
										
                                            <span className="text-xl text-center font-bold  text-blue-500">
                                               ADD LABORATORY
                                            </span>
                                      
									</div> */}
                                    <Controller
										name="lab_test"
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
														Select Laboratory
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
												placeholder="Select laboratory Test"
												options={[
													// {
													// 	label: "Provincial Hospital (PH)",
													// 	value: "PH",
													// },
													{
														label: "FBS",
														value: "FBS",
													},
                                                    {
														label: "RBS",
														value: "RBS",
													},
                                                    {
														label: "Creatinine",
														value: "Creatinine",
													},
                                                    {
														label: "Uric Acid",
														value: "Uric Acid",
													},
                                                    {
														label: "SGOT",
														value: "SGOT",
													},
                                                    {
														label: "SGPT",
														value: "SGPT",
													},
                                                    {
														label: "Alkaline Phos.",
														value: "Alkaline Phos.",
													},
                                                    {
														label: "LDH",
														value: "LDH",
													},
                                                    {
														label: "GGT",
														value: "GGT",
													},
                                                    {
														label: "Magnesium",
														value: "Magnesium",
													},
                                                    {
														label: "Phophorus",
														value: "Phophorus",
													},
                                                    {
														label: "Amylase",
														value: "Amylase",
													},
													// {
													// 	label: "Barangay Health Station (BHS)",
													// 	value: "BHS",
													// },
												]}
											/>
										)}
									/>
									<Controller
										name="image"
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
											<div className="flex flex-col">
												<span
													className={`text-sm mb-1 font-medium text-dark ${
														hasError("attachment")
															? "text-red-500"
															: ""
													}`}
												>
													Upload Image
												</span>
												<ImagePicker
													onChange={(data) => {
														onChange(data);
														setImage(data);
													}}
                                        // {...register("rhu_xray_result", {
										// 	required: "The Remarks is required.",
										// })}
										// errors={errors?.rhu_xray_result?.message}
												>
													{({ imagePreview }) => {
														return (
															<div className="border border-slate-300 aspect-video relative ">
																<img
																	src={
																		imagePreview
																			? imagePreview
																			: upload
																	}
																	className="object-contain absolute top-0 left-0 w-full h-full bg-slate-300"
																/>
																{imagePreview ? (
																	""
																) : (
																	<span className="absolute w-full text-center bottom-3 uppercase font-bold text-slate-500">
																		Upload
																		Image
																	</span>
																)}
															</div>
														);
													}}
                                                    
												</ImagePicker>
												{hasError("image") ? (
													<p className="mt-0 text-xs text-red-600 dark:text-red-500 mb-0">
														{hasError("image")}
													</p>
												) : (
													""
												)}
											</div>
										)}
									/>
									<Controller
										name="rhu_xray_remarks"
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
											<ReactQuillField
												name={name}
												error={error}
												label="Remarks"
												value={value}
												onChange={onChange}
											/>
										)}
                                        {...register("rhu_xray_remarks", {
											required: "The Remarks is required.",
										})}
										errors={errors?.rhu_xray_remarks?.message}
									/>
								</div>

								<div className="px-4 py-4 border-t flex items-center justify-end bg-slate-">
									<ActionBtn
										// size="lg"
										type="danger"
										// loading={saving}
										className="px-5 mr-auto"
										onClick={hide}
									>
										CLOSE
									</ActionBtn>
									<ActionBtn
										// size="lg"
										type="success"
										loading={saving}
										className="px-5"
										onClick={handleSubmit(submit)}
									>
										SUBMIT
									</ActionBtn>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
  )
}

export default forwardRef(UploadLaboratoryTest)
