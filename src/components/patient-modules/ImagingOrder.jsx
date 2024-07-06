import React, { useRef } from 'react'
import useDataTable from '../../hooks/useDataTable';
import useNoBugUseEffect from '../../hooks/useNoBugUseEffect';
import FlatIcon from '../FlatIcon';
import ContentTitle from '../buttons/ContentTitle';
import ActionBtn from '../buttons/ActionBtn';
import Table from '../table/Table';
import Pagination from '../table/Pagination';
import DeleteOrderModal from './modals/DeleteOrderModal';
import ViewLabResultModal from './modals/ViewLabResultModal';
import CreateLabOrderModal from './modals/CreateLabOrderModal';
import UploadLabResultModal from './modals/UploadLabResultModal';
import UploadADLESModal from './modals/imaging/ultrasound/UploadADLESModal';
import UploadAppendixModal from './modals/imaging/ultrasound/UploadAppendixModal';
import UploadAspirationModal from './modals/imaging/ultrasound/UploadAspirationModal';
import UploadAVDLEBModal from './modals/imaging/ultrasound/UploadAVDLEBModal';
import UploadAVDLESModal from './modals/imaging/ultrasound/UploadAVDLESModal';
import UploadBiopsyModal from './modals/imaging/ultrasound/UploadBiopsyModal';
import UploadBPSModal from './modals/imaging/ultrasound/UploadBPSModal';
import UploadBreastBothModal from './modals/imaging/ultrasound/UploadBreastBothModal';
import UploadBreastElastoModal from './modals/imaging/ultrasound/UploadBreastElastoModal';
import UploadBreastSingleModal from './modals/imaging/ultrasound/UploadBreastSingleModal';
import UploadChestThoraxModal from './modals/imaging/ultrasound/UploadChestThoraxModal';
import UploadHBTModal from './modals/imaging/ultrasound/UploadHBTModal';
import UploadInguinalModal from './modals/imaging/ultrasound/UploadInguinalModal';
import UploadInguinoscrotalModal from './modals/imaging/ultrasound/UploadInguinoscrotalModal';
import UploadKUBOnlyModal from './modals/imaging/ultrasound/UploadKUBOnlyModal';
import UploadKUBPelvisModal from './modals/imaging/ultrasound/UploadKUBPelvisModal';
import UploadKUBProstateModal from './modals/imaging/ultrasound/UploadKUBProstateModal';
import UploadLowerAbdomenModal from './modals/imaging/ultrasound/UploadLowerAbdomenModal';
import UploadNeckModal from './modals/imaging/ultrasound/UploadNeckModal';
import UploadNeckUSDModal from './modals/imaging/ultrasound/UploadNeckUSDModal';
import UploadPelvisModal from './modals/imaging/ultrasound/UploadPelvisModal';
import UploadPregnantModal from './modals/imaging/ultrasound/UploadPregnantModal';
import UploadScrotumModal from './modals/imaging/ultrasound/UploadScrotumModal';
import UploadSuperFacialSoftTissueModal from './modals/imaging/ultrasound/UploadSuperFacialSoftTissueModal';
import UploadThyroidUSDModal from './modals/imaging/ultrasound/UploadThyroidUSDModal';
import UploadTVSModal from './modals/imaging/ultrasound/UploadTVSModal';
import UploadUpperAbdomenModal from './modals/imaging/ultrasound/UploadUpperAbdomenModal';
import UploadVDLESModal from './modals/imaging/ultrasound/UploadVDLESModal';
import UploadWabAppendixModal from './modals/imaging/ultrasound/UploadWabAppendixModal';
import UploadWholeAbdomenModal from './modals/imaging/ultrasound/UploadWholeAbdomenModal';
import { useAuth } from '../../hooks/useAuth';

const Status = ({ status }) => {
	const color = () => {
		switch (status) {
			case "pending":
				return " text-red-700";
			case "for-result-reading":
				return " text-blue-700";
			default:
				return " text-white";
		}
	};
	return (
		<span
			className={`${color()} px-2 italic text-center rounded-2xl text-xs py-[2px]`}
		>
			{status}
		</span>
	);
};
const ImagingOrder = (props) => {
  const {
		showTitle = true,
		appointment,
		patient,
		laboratory_test_type,
		allowCreate = true,
		onUploadLabResultSuccess,
		order_id,
	} = props;
	const { user } = useAuth();

	const isLaboratoryUser = () => {
		return user?.type == "HIS-Imaging" || user?.type == "HIS-Laboratory";
	};
	const isXrayUser = () => {
		return user?.type === "HIS-Imaging";
	};
	const testHeader = isXrayUser() ? "Imaging Test" : "Laboratory Test";
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
		reloadData,
	} = useDataTable({
		url: `/v1/doctor/laboratory-order/patient/${patient?.id}`,
		defaultFilters: {
			...(order_id ? { order_id: order_id } : {}),
			...(laboratory_test_type
				? { laboratory_test_type: laboratory_test_type }
				: {}),
			...(appointment?.id > 0 ? { appointment_id: appointment?.id } : {}),
		},
	});
	useNoBugUseEffect({
		functions: () => {
			setFilters((prevFilters) => ({
				...prevFilters,

				order_id: order_id,
			}));
		},
	});
	const createLabOrderRef = useRef(null);
	const uploadLabResultRef = useRef(null);
	const viewLabResultRef = useRef(null);

	//chemistry ref
	const uploadADLESRef = useRef(null);
	const uploadAppendixRef = useRef(null);
	const uploadGuidedAspirationRef = useRef(null);
	const uploadAVDLEBRef = useRef(null);
	const uploadAVDLESRef = useRef(null);
	const uploadGuidedBiopsyRef = useRef(null);
	const uploadBPSRef = useRef(null);
	const uploadBreastBothRef = useRef(null);
	const uploadBreastElastoRef = useRef(null);
	const uploadBreastUSDSingleRef = useRef(null);
	const uploadChestThoraxRef = useRef(null);
	const uploadHBTRef = useRef(null);
	const uploadInguinalRef = useRef(null);
	const uploadInguinoscrotalRef = useRef(null);
	const uploadKUBOnlyRef = useRef(null);
	const uploadKUBPelvisRef = useRef(null);
	const uploadKUBProstateRef = useRef(null);
	const uploadLowerAbdomenRef = useRef(null);
	const uploadNeckRef = useRef(null);
	const uploadNeckUsdRef = useRef(null);
	const uploadPelvisRef = useRef(null);
	const uploadPregnantRef = useRef(null);
	const uploadScrotumRef = useRef(null);
	const uploadSuperficialRef = useRef(null);
	const uploadThyroidUSDRef = useRef(null);
	const uploadTVSRef = useRef(null);
	const uploadUpperAbdomenRef = useRef(null);
	const uploadVDLESRef = useRef(null);
	const uploadWabAppendixRef = useRef(null);
	const uploadWholeAbdomenRef = useRef(null);


	const deleteLabOrderRef = useRef(null);
	const isDoctor = () => {
		return String(user?.type || "")
			.toLowerCase()
			.includes("doctor");
	};

	const renderResultCell = (data) => {
    if (data?.order_status === "pending") {
        if (isLaboratoryUser()) {
            const labModalRefs = {
				//Chemistry
                "ARTERIAL  DOPPLER LOWER EXT SINGLE": uploadADLESRef,
                "APPENDIX": uploadAppendixRef,
                "GUIDED ASPIRATION": uploadGuidedAspirationRef,
                "ARTERIOVENOUS DOPPLER LOWER EXT BOTH": uploadAVDLEBRef,
                "ARTERIOVENOUS DOPPLER LOWER EXT SINGLE": uploadAVDLESRef,
                "GUIDED BIOPSY": uploadGuidedBiopsyRef,
                "BPS": uploadBPSRef,
                "BREAST BOTH": uploadBreastBothRef,
                "BREAST ELASTO": uploadBreastElastoRef,
                "BREAST ULTRASOUND (SINGLE)": uploadBreastUSDSingleRef,
                "CHEST / THORAX": uploadChestThoraxRef,
                "HBT": uploadHBTRef,
				"INGUINAL ULTRASOUND": uploadInguinalRef,
                "INGUINOSCROTAL": uploadInguinoscrotalRef,
                "KUB ONLY": uploadKUBOnlyRef,
                "KUB / PELVIS ULTRASOUND": uploadKUBPelvisRef,
                "KUB/PROSTATE": uploadKUBProstateRef,
                "LOWER ABDOMEN": uploadLowerAbdomenRef,
                "NECK": uploadNeckRef,
                "NECK USD": uploadNeckUsdRef,
				"PELVIS": uploadPelvisRef,
                "PREGNANT": uploadPregnantRef,
                "SCROTUM/ TESTES": uploadScrotumRef,
                "SUPERFICIAL SOFT TISSUE": uploadSuperficialRef,
                "THYROID USD": uploadThyroidUSDRef,
                "TVS": uploadTVSRef,
				"UPPER ABDOMEN": uploadUpperAbdomenRef,
				"VENOUS DOPPLER LOWER EXT SINGLE": uploadVDLESRef,
                "WAB + APPENDIX": uploadWabAppendixRef,
                "WHOLE ABDOMEN": uploadWholeAbdomenRef,
				
			};
            const modalRef = labModalRefs[data?.type?.name] || uploadLabResultRef;
            return (
                <span
                    className="text-blue-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 py-2 rounded-3xl gap-1"
                    onClick={() => modalRef.current.show(data)}
                >
                    <FlatIcon icon="rr-upload" />
                    {data?.type?.name === "CBC" ? "Add Result" : "Upload"}
                </span>
            );
        } else {
            return <Status status={data?.order_status} />;
        }
    } else if (data?.order_status === "for-result-reading") {
        return (
            <span
                className="text-blue-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 py-2 rounded-3xl gap-1"
                onClick={() => viewLabResultRef.current.show({...data, appointment})}
            >
                <FlatIcon icon="rs-document" />
                View Result
            </span>
        );
    } else {
        return null;
    }
};
  return (
    <div className="flex flex-col items-start">
			{showTitle ? (
				<ContentTitle
					title={
						laboratory_test_type == 1
							? "Imaging Order"
							: "Laboratory Order"
					}
				>
					{user?.type == "HIS-Doctor" && allowCreate ? (
						<ActionBtn
							className="px-4 rounded-xl"
							size="sm"
							type="success"
							onClick={() => {
								createLabOrderRef.current.show(
									patient,
									appointment,
									laboratory_test_type == 1
										? "imaging"
										: "laboratory-test"
								);
								// setUpdate(true);
							}}
						>
							<FlatIcon icon="rr-edit" className="mr-1" />
							Create{" "}
							{laboratory_test_type == 1
								? "Imaging"
								: "Laboratory"}{" "}
							Order
						</ActionBtn>
					) : (
						""
					)}
				</ContentTitle>
			) : (
				""
			)}
			<Table
				className={`pb-2`}
				loading={loading}
				columns={[
					{
						header: "Order Date",
						className: "text-left",
						tdClassName: "text-left",
						key: "date",
						cell: (data) => {
							return formatDateMMDDYYYY(
								new Date(data?.order_date)
							);
						},
					},
					{
						header: testHeader,
						className: "text-left",
						tdClassName: "text-left",
						key: "type",
						cell: (data) => {
							return data?.type?.name;
						},
					},
					{
						header: "Notes",
						className: "text-left",
						tdClassName: "text-left",
						key: "notes",
					},
					{
						header: "Doctor",
						className: "text-left",
						tdClassName: "text-left",
						key: "doctor",
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
						header: "Status",
						className: "text-center ",
						tdClassName: "text-center",
						key: "order_status",
						cell: (data) => {
							return <Status status={data?.order_status} />;
						},
					},
					{
						header: "Result",
						className: "text-center",
						tdClassName: "text-center",
						key: "order_status",
						cell: renderResultCell,
					},
					{
						header: "Delete",
						className: `text-center ${isDoctor() ? "" : "hidden"}`,
						tdClassName: `text-center ${
							isDoctor() ? "" : "hidden"
						}`,
						key: "delete",
						cell: (data) => {
							return (
								<div className="w-full flex items-center">
									{/* {JSON.stringify(data)} */}
									<ActionBtn
										size="sm"
										type="danger"
										disabled={
											data?.order_status ==
											"for-result-reading"
										}
										className=" mx-auto"
										onClick={() => {
											deleteLabOrderRef.current.show(
												data
											);
										}}
									>
										<FlatIcon icon="rr-trash" /> Delete
									</ActionBtn>
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
			<CreateLabOrderModal
				patient={patient}
				onSuccess={() => {
					reloadData();
				}}
				ref={createLabOrderRef}
			/>

			<UploadLabResultModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadLabResultRef}
			/>
			<UploadADLESModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadADLESRef}
			/>c
			<UploadAppendixModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAppendixRef}
			/>
			<UploadAspirationModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadGuidedAspirationRef}
			/>
			<UploadAVDLEBModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAVDLEBRef}
			/>
			<UploadAVDLESModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAVDLESRef}
			/>
			<UploadBiopsyModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadGuidedBiopsyRef}
			/>
			<UploadBPSModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadBPSRef}
			/>
			<UploadBreastBothModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadBreastBothRef}
			/>
			<UploadBreastElastoModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadBreastElastoRef}
			/>
			<UploadBreastSingleModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadBreastUSDSingleRef}
			/>
			<UploadChestThoraxModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadChestThoraxRef}
			/>
			<UploadHBTModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadHBTRef}
			/>
			<UploadInguinalModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadInguinalRef}
			/>
			<UploadInguinoscrotalModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadInguinoscrotalRef}
			/>
			<UploadKUBOnlyModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadKUBOnlyRef}
			/>
			<UploadKUBPelvisModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadKUBPelvisRef}
			/>
			<UploadKUBProstateModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadKUBProstateRef}
			/>
			<UploadLowerAbdomenModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadLowerAbdomenRef}
			/>
			<UploadNeckModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadNeckRef}
			/>
			<UploadNeckUSDModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadNeckUsdRef}
			/>
			<UploadPelvisModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadPelvisRef}
			/>
			<UploadPregnantModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadPregnantRef}
			/>
			<UploadScrotumModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadScrotumRef}
			/>
			<UploadSuperFacialSoftTissueModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadSuperficialRef}
			/>
			<UploadThyroidUSDModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadThyroidUSDRef}
			/>
			<UploadTVSModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadTVSRef}
			/>
			<UploadUpperAbdomenModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadUpperAbdomenRef}
			/>
			<UploadVDLESModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadVDLESRef}
			/>
			<UploadWabAppendixModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadWabAppendixRef}
			/>
			<UploadWholeAbdomenModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadWholeAbdomenRef}
			/>

			<ViewLabResultModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={viewLabResultRef}
			/>
			<DeleteOrderModal
				ref={deleteLabOrderRef}
				onSuccess={() => {
					reloadData();
				}}
			/>
		</div>
  )
}

export default ImagingOrder
