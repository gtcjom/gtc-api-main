
import React, { Fragment, forwardRef, useImperativeHandle, useState } from 'react'
import { useForm } from 'react-hook-form';
import useNoBugUseEffect from '../../../../../../hooks/useNoBugUseEffect';
import Axios from '../../../../../../libs/axios';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import TextInputField from '../../../../../inputs/TextInputField';
import ActionBtn from '../../../../../buttons/ActionBtn';

const UploadCastsModal = (props, ref) => {
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

		let formdata = new FormData();

		formdata.append("_method", "PATCH");
		formdata.append("hyaline_cast_urine", data?.hyaline_cast_urine);
		formdata.append("wbc_cast_urine", data?.wbc_cast_urine);
		formdata.append("rbc_cast_urine", data?.rbc_cast_urine);
		formdata.append("granular_cast_urine", data?.granular_cast_urine);
		Axios.post(`v1/clinic/tb-lab-result/${showData?.id}`, formdata)
			.then((res) => {
				reset();
				toast.success("Laboratory result submitted successfully!");
				onSuccess();
				hide();
			})
			.finally(() => {
				setTimeout(() => {
					setSaving(false);
				}, 1000);
			});
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
										Microscopy Examination Result
									</span>
                                    <span className="text-sm text-center font-bold  text-blue-600 mt-2">
										Casts Result
									</span>
								</Dialog.Title>
								<div className="p-6 flex flex-col gap-y-4 relative">
									<TextInputField
										label="Hyaline Cast"
										placeholder=""
										{...register("hyaline_cast_urine", {
											required:
												"The Specimen Type is required.",
										})}
										errors={errors?.hyaline_cast_urine?.message}
									/>
									<TextInputField
										label="WBC Cast"
										placeholder=""
										{...register("wbc_cast_urine", {
											required:
												"The Specimen Source is required.",
										})}
										errors={errors?.wbc_cast_urine?.message}
									/>
									<TextInputField
										label="RBC Cast"
										placeholder=""
										{...register("rbc_cast_urine", {
											required: "The Remarks is required.",
										})}
										errors={errors?.rbc_cast_urine?.message}
									/>
                                    <TextInputField
										label="Granular Cast"
										placeholder=""
										{...register("granular_cast_urine", {
											required: "The Remarks is required.",
										})}
										errors={errors?.granular_cast_urine?.message}
									/>
								</div>

								<div className="px-4 py-4 border-t flex items-center justify-end bg-slate-">
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

export default forwardRef(UploadCastsModal)
