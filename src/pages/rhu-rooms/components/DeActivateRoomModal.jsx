/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-refresh/only-export-components */
import {
	Fragment,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ActionBtn from "../../../components/buttons/ActionBtn";
import Axios from "../../../libs/axios";

const DeActivateRoomModal = (props, ref) => {
	const { onSuccess } = props;
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
	const [mount, setMount] = useState(0);
	const [room, setRoom] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

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

	const show = (showData = null) => {
		setModalOpen(true);
		setTimeout(() => {
			setValue("status", "active");
		}, 200);
		setRoom(showData);
	};
	const hide = () => {
		setModalOpen(false);
	};

	const submit = (data) => {
		let formData = new FormData();

		formData.append("status", "inactive");

		let url = `v1/operating-rooms/deactivate`;
		if (room?.id) {
			url = `v1/operating-rooms/deactivate/${room?.id}`;
			formData.append("_method", "PATCH");
		}
		Axios.post(url, formData).then((res) => {
			setTimeout(() => {
				toast.success("Room deactivated successfully!");
				if (onSuccess) {
					onSuccess();
				}
			}, 200);

			hide();
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
							<Dialog.Panel className="w-full lg:max-w-md transform overflow-visible rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="div"
									className="py-3 px-4 flex flex-col border-b "
								>
									<span className="text-xl font-bold  text-blue-900">
										Deactivate Room
									</span>
									{/* <span className="text-sm font-light text-blue-900 ">
										Complete form to{" "}
										{room?.id
											? "update "
											: "create new "}{" "}
										Room
									</span> */}
								</Dialog.Title>
								<div className="px-4 pt-11 pb-11 grid grid-cols-1 gap-6 relative">
									<p className="text-lg text-red-600 text-center">
										Are you sure to deactivate{" "}
										<b className="underline">
											{room?.name}{" "}
										</b>
										Room?
									</p>
								</div>

								<div className="px-4 py-4 flex items-center justify-end bg-slate- border-t">
									<ActionBtn
										type="foreground"
										className="mr-auto"
										onClick={hide}
									>
										Cancel
									</ActionBtn>
									<ActionBtn
										type="danger"
										className="ml-4"
										onClick={handleSubmit(submit)}
									>
										Yes, deactivate!
									</ActionBtn>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default forwardRef(DeActivateRoomModal);
