/* eslint-disable react/prop-types */
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../../libs/axios";
/* 
const data = [
	{ time: " 8:00 PM", data: 12 },
	{ time: " 9:00 PM", data: 15 },
	{ time: "10:00 PM", data: 12 },
	{ time: "11:00 PM", data: 14 },
	{ time: "12:00 PM", data: 16 },
]; */
const CustomTooltip = ({ active, payload, label }) => {
	const getValue = (v) => {
		return <span className={`font-bold text-darker`}>{v}</span>;
	};
	if (active && payload && payload.length) {
		return (
			<div className="bg-white rounded-xl shadow flex flex-col gap-y-1 p-2 items-center justify-center">
				<label className="text-sm mb-0 text-secondary">
					{payload[0]?.payload?.time}
				</label>
				<label className="text-sm mb-0">Respiration: </label>
				{getValue(payload[0].value)} breaths per minute
			</div>
		);
	}

	return null;
};
const RespirationChart = ({ w, h, patient }) => {
	const { id } = useParams();
	const [data, setData] = useState([]);

	useEffect(() => {
		if (patient?.id) {
			getData();
		}
	}, [patient?.id]);

	const getData = () => {
		Axios.get(
			`/v1/clinic/patient-charts/${patient?.id}?chart_type=respiratory`
		).then((res) => {
			let _labels = res.data?.labels;
			let _values = res.data?.values;
			setData(
				_values?.map((item, index) => ({
					data: item,
					time: _labels[index],
				}))
			);
		});
	};

	return (
		<LineChart
			width={w}
			height={h}
			data={data}
			margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
		>
			<Line
				type="monotone"
				dataKey="data"
				stroke="#8884d8"
				activeDot={{ r: 16 }}
			/>
			<CartesianGrid stroke="#ccc" strokeDasharray="10 10" />
			<XAxis dataKey="time" />
			<YAxis domain={[0, 25]} />
			<Tooltip content={CustomTooltip} />
		</LineChart>
	);
};

export default RespirationChart;
