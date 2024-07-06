
import useDataTable from "../../../hooks/useDataTable";
import React, { useEffect, useRef, useState } from "react";
import FlatIcon from "../../FlatIcon";
import InfoTextForPrint from "../../InfoTextForPrint";
import { dateToday, formatDate } from "../../../libs/helpers";
import ActionBtn from "../../buttons/ActionBtn";
import SummaryOfCharges from "./billing/SummaryOfCharges";
import SummaryWithPhic from "./billing/SummaryWithPhic";
import ProfessionalFeeSOA from "./billing/ProfessionalFeeSOA";
import { useAuth } from "../../../hooks/useAuth";
import useNoBugUseEffect from "../../../hooks/useNoBugUseEffect";
// import { useReactToPrint } from "react-to-print";

/* eslint-disable react/prop-types */
const BillingStatement = (props) => {
	const { loading: btnLoading, appointment, patient, onSave } = props;
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const componentRef = React.useRef(null);
	const billingStatus = patient?.billing_status || "mgh";
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
	useNoBugUseEffect({
		functions: () => {
			setTimeout(() => {
				setLoading(false);
			}, 2000);
		},
		params: [appointment],
	});
	const handleSave = () => {
		if (onSave) {
			onSave();
		}
		// Logic for saving the invoice
		// You can implement your save logic here
	};

	return (
		<div className="relative">
			{loading ? (
				<div className="absolute top-0 left-0 h-full w-full flex items-start justify-center bg-slate-200 bg-opacity-95 backdrop-blur pt-[244px] z-10">
					<div className="flex items-center justify-center text-2xl animate-pulse">
						Loading, please wait...
					</div>
				</div>
			) : (
				""
			)}
			<div className="m-2">
				<div className=" gap-2 text-base">
					<FlatIcon icon="rr-wallet" className="text-base" />
					<span className="text-lg font-semibold m-2">
						Status: {""}
						<span className="text-yellow-700">Pending</span>
						{/* {billingStatus === "pending" ? (
							<span className="text-yellow-700">Pending</span>
						) : (
							<span className="text-green-700">MGH</span>
						)} */}
					</span>
				</div>
			</div>

			<div className="border shadow p-2">
				<div className="text-justify mt-12" ref={componentRef}>
					<div className="text-base text-center font-semibold">
						<span>SARANGANI PROVINCIAL HOSPITAL</span>
					</div>
					<div className="text-sm text-center font-light ">
						<span>Capitol Complex, Alabel, Sarangani</span>
					</div>
					<div className="text-sm text-center font-light ">
						<span>Tel. No. 083 508 0262</span>
					</div>
					<div className="text-base text-center font-semibold m-4">
						<span>PATIENT'S STATEMENT OF ACCOUNT</span>
					</div>
					<div className="text-base text-center font-semibold m-4">
						<span>FINAL BILL</span>
					</div>

					<div className="grid grid-cols-2">
						<div className="m-2">
							<InfoTextForPrint
								className="items-center gap-2 text-base"
								title="Number of Days"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 m-2">
						<div className="m-2">
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Fullname"
								value={`${patient?.lastname}, ${patient?.firstname}, ${patient?.middle}`}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Address"
								value={`${patient?.street}, ${patient?.zone}, ${
									patient?.barangay?.name
								}, ${
									patient?.municipality?.name
								}, ${"Sarangani"}`} //add a city ${patient?.city?.name}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Date/Time Admitted"
								// value={patient?.civil_status}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Date/Time Discharge"
								// value={patient?.civil_status}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Attending Physician"
								// value={patient?.civil_status}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="MSS Classification"
								// value={patient?.civil_status}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Final Diagnosis"
								// value={patient?.civil_status}
							/>
						</div>
						<div className="m-2">
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Date Today"
								value={formatDate(patient?.birthday)}
							/>

							<InfoTextForPrint
								contentClassName="text-sm"
								title="Hospital No."
								// value={patient?.civil_status}
							/>

							<InfoTextForPrint
								contentClassName="text-sm"
								title="Account No."
								// value={patient?.civil_status}
							/>

							<InfoTextForPrint
								contentClassName="text-sm"
								title="Ward"
								// value={patient?.civil_status}
							/>

							<InfoTextForPrint
								contentClassName="text-sm"
								title="Room"
								// value={patient?.civil_status}
							/>

							<InfoTextForPrint
								contentClassName="text-sm"
								title="Bed"
								// value={patient?.civil_status}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Age"
								// value={patient?.civil_status}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="PHIC Membership"
								// value={patient?.civil_status}
							/>
						</div>
					</div>
					<SummaryOfCharges
						appointment={appointment}
						patient={patient}
						className="m-2"
					/>
					<SummaryWithPhic
						appointment={appointment}
						patient={patient}
						className="m-2"
					/>
					<ProfessionalFeeSOA
						appointment={appointment}
						patient={patient}
						className="m-2"
					/>
					<div className="grid grid-cols-2">
						<div className="mt-8 ml-4">
							<InfoTextForPrint
								contentClassName="text-sm"
								title="CERTIFIED CORRECT BY"
								value={user?.name}
							/>
						</div>
						<div className="mt-8 mr-4">
							<InfoTextForPrint
								contentClassName="text-sm"
								title="OR Number"
								value={""}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Amount"
								value={patient?.civil_status}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Date"
								value={dateToday()}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2">
						<div className="mt-4 ml-4">
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Contact No."
								// value={patient?.civil_status}
							/>
							<p className="text-xs">PLEASE PAY AT THE CASHIER</p>
						</div>
						<div className="mt-8 mr-4">
							<p className="text-xs">
								Signature Over Printed Name of Member or
								Representative
							</p>
						</div>
					</div>
				</div>

				<div className="p-4 flex items-center justify-end">
					{billingStatus === "mgh" && (
						<ActionBtn
							className="text-base gap-2 ml-2"
							onClick={handlePrint}
						>
							<FlatIcon icon="rr-print" /> Print
						</ActionBtn>
					)}
					{/* Adding more billing-related information here if needed */}
					<ActionBtn
						type="success"
						className="ml-2"
						loading={btnLoading}
						onClick={handleSave}
					>
						<FlatIcon icon="rr-check" />
						Done
					</ActionBtn>
					{/* <ActionBtn className="ml-2" onClick={handleDownload}>
                    Download
                  </ActionBtn>  */}
				</div>
			</div>
		</div>
	);
};

export default BillingStatement;
