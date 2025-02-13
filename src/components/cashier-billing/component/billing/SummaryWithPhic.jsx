import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { procedureRates } from "../../../../libs/procedureRates";
import { caseCodes } from "../../../../libs/caseCodes";
import { formatCurrency } from "../../../../libs/helpers";
/* eslint-disable react/prop-types */
const uniq_id = uuidv4();
const SummaryWithPhic = (props) => {
	const { patient, appointment } = props;
	const [summaryData, setSummaryData] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/v1/phic-summary-items`);
				if (!response.ok) {
					throw new Error("Failed to fetch data");
				}
				const data = await response.json();
				setSummaryData(data);
			} catch (error) {
				console.error("Error fetching summary data:", error);
			}
		};

		fetchData();
	}, []);
	let diagnosis = caseCodes?.find(
		(x) => x.CASE_CODE == appointment?.diagnosis_code
	);
	return (
		<>
			<div className="border shadow p-2">
				<h5 className="text-sm font-semibold text-center mb-4 ">
					Summary of Charges - PHIC
				</h5>

				<div className="flex text-base font-semibold m-2">
					<p>
						ICD-10 Code: {diagnosis?.CASE_CODE} -{" "}
						{diagnosis?.CASE_RATE_CODE}
					</p>
				</div>

				<div className="grid grid-cols-2">
					<div className="text-xs">
						Firstcase description: {diagnosis?.CASE_DESCRIPTION}
					</div>
					<div className="text-xs">Secondcase description: N/A</div>
				</div>
				<div className="border rounded-md mt-2">
					<div className="border bg-gray-100 rounded-sm grid grid-cols-7 divide-x text-sm font-semibold text-center">
						<div className="col-span-2">PARTICULARS</div>
						<div className="col-span-1">ACTUAL CHARGES</div>
						<div className="col-span-1">
							SENIOR CITIZEN / PWD DISCOUNT
						</div>
						<div className="col-span-1">FIRST CASE</div>
						<div className="col-span-1">SECOND CASE</div>
						<div className="col-span-1">BALANCE</div>
					</div>
					<div className="grid grid-cols-7 divide-x text-xs font-light text-center mt-2">
						<div className="col-span-2 text-left ml-2">
							Hospital Charges
						</div>
						<div className="col-span-1">
							{/* add a code for Debit database */}
							{formatCurrency(diagnosis?.HOSPITAL_SHARE)}
						</div>
						<div className="col-span-1">0.00</div>
						<div className="col-span-1">
							{formatCurrency(diagnosis?.HOSPITAL_SHARE)}
						</div>
						<div className="col-span-1">
							{/* {patient?.hc_second_case_rate} */}
						</div>
						<div className="col-span-1">
							{formatCurrency(diagnosis?.HOSPITAL_SHARE)}
						</div>
					</div>
					<div className="grid grid-cols-7 divide-x text-xs font-light text-center mt-2">
						<div className="col-span-2 text-left ml-2">
							Professional Fees
						</div>
						<div className="col-span-1">
							{/* add a code for Debit database */}
							{formatCurrency(
								diagnosis?.PROFESSIONAL_FEE_PF_SHARE
							)}
						</div>
						<div className="col-span-1">0.00</div>
						<div className="col-span-1">
							{formatCurrency(
								diagnosis?.PROFESSIONAL_FEE_PF_SHARE
							)}
						</div>
						<div className="col-span-1"></div>
						<div className="col-span-1">
							{formatCurrency(
								diagnosis?.PROFESSIONAL_FEE_PF_SHARE
							)}
						</div>
					</div>

					<div className="grid grid-cols-7 border-t divide-x text-sm font-semibold text-center mt-2">
						<div className="col-span-2 text-right mr-1">Total:</div>
						<div className="col-span-1">
							{/* add a code for Debit database */}
							{formatCurrency(
								parseFloat(diagnosis?.HOSPITAL_SHARE || 0) +
									parseFloat(
										diagnosis?.PROFESSIONAL_FEE_PF_SHARE ||
											0
									)
							)}
						</div>
						<div className="col-span-1">
							{patient?.total_senior_pwd_discount}
						</div>
						<div className="col-span-1">
							{patient?.total_first_case_rate}
						</div>
						<div className="col-span-1">
							{patient?.total_second_case_rate}
						</div>
						<div className="col-span-1">
							{formatCurrency(
								parseFloat(diagnosis?.HOSPITAL_SHARE || 0) +
									parseFloat(
										diagnosis?.PROFESSIONAL_FEE_PF_SHARE ||
											0
									)
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SummaryWithPhic;
