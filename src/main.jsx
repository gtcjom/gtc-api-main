import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import Login from "./pages/auth/login.jsx";
import Patients from "./pages/patients/Patients.jsx";
import axios from "./libs/axios.js";
import { getStorage } from "./libs/storage";
import { toast } from "react-toastify";
import PatientConsultation from "./pages/consultation/PatientConsultation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/appointments/Appointments.jsx";
import MyAccount from "./pages/my-account/MyAccount.jsx";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import PatientQueue from "./pages/patient-queue/PatientQueue.jsx";
import Root from "./Root.jsx";
import AppRoutes from "./AppRoutes.jsx";
import RHULists from "./pages/rhu-lists/RHULists.jsx";
import DoctorSpecialties from "./pages/doctor-specialties/DoctorSpecialties.jsx";
import RHUPersonnels from "./pages/rhu-personnels/RHUPersonnels.jsx";
import RHURooms from "./pages/rhu-rooms/RHURooms.jsx";
import LaboratoryTests from "./pages/laboratory-tests/LaboratoryTests.jsx";
import DoctorPatientQueue from "./pages/doctor-patient-queue/DoctorPatientQueue.jsx";
import PatientLabQueue from "./pages/patient-lab-queue/PatientLabQueue.jsx";
import Error404 from "./Error404.jsx";
import PatientPharmacyQueue from "./pages/patient-pharmacy-queue/PatientPharmacyQueue.jsx";
import Consignments from "./pages/consignments/Consignments.jsx";
import Inventories from "./pages/inventories/Inventories.jsx";
import DoctorPatientReferrals from "./pages/doctor-patient-referrals/DoctorPatientReferrals.jsx";
import PatientCashierQueue from "./pages/patient-queue/PatientCashierQueue.jsx";
import Echo from 'laravel-echo';
 
import Pusher from 'pusher-js';
import PatientAnestesiaQueue from "./pages/department/his-anesthesia/PatientAnestesiaQueue.jsx";
import Inventory from "./pages/department/his-nurse/Inventory.jsx";
import PatientMonitoring from "./pages/department/his-anesthesia/PatientMonitoring.jsx";
import PatientERQueue from "./pages/hims/PatientERQueue.jsx";
import PatientDeliveryQueue from "./pages/department/his-delivery/PatientDeliveryQueue.jsx";
import PatientOPDInfectiousQueue from "./pages/hims/his-opd-infectious/PatientOPDInfectiousQueue.jsx";
import ICUNurseQueue from "./pages/department/his-icu-nurse/ICUNurseQueue.jsx";
window.Pusher = Pusher;
 
axios.interceptors.request.use(
	async function (config) {
		const token = await getStorage("token");
		console.log("axios.interceptors.request");
		if (token) {
			config.headers["Authorization"] = "Bearer " + token;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);
const removeSession = () => {
	if (!window.location.pathname.includes("login")) {
		setTimeout(() => {
			toast.error(
				"Session expired! Login to your credentails to continue."
			);
		}, 500);
		window.localStorage.clear();
		window.location.pathname = "/login";
	}
};
axios.interceptors.response.use(
	(response) => {
		if (response.status === 500) {
			toast.error("Unable to connect to server!");
			return Promise.reject({ response });
		}

		return response;
	},
	(error) => {
		if (error.response) {
			const code = error.response.status;

			switch (parseInt(code)) {
				case 401:
				case 403:
					removeSession();
					break;

				case 500:
					// toast.error("Internal server error");
					break;
			}

			if (error.response && error.response.data) {
				return Promise.reject(error);
			}
		}

		return Promise.reject(error.message);
	}
);
// const router = createBrowserRouter([

// 	{
// 		path: "/login",
// 		element: <Login />,
// 	},
// 	{
// 		path: "/",
// 		element: <Root />,
// 	},
// 	{
// 		path: "/virtual-consultation",
// 		element: <App />,
// 	},
// 	{
// 		path: "/appointments",
// 		element: <Appointments />,
// 	},
// 	{
// 		path: "/patients",
// 		element: <Patients />,
// 	},
// 	{
// 		path: "/patient-queue",
// 		element: <PatientQueue />,
// 	},
// 	{
// 		path: "/my-account",
// 		element: <MyAccount />,
// 	},
// 	{
// 		path: "/consultation",
// 		element: <PatientConsultation />,
// 	},
// ]);
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />}>
			<Route path="index" element={<AppRoutes />}></Route>
			<Route path="login" element={<Login />}></Route>
			<Route path="his-nurse">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="telemedicine" element={<Appointments />}></Route>
				<Route path="patient-queue" element={<PatientQueue />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
				<Route path="inventory" element = {<Inventory />}></Route>
			</Route>
			<Route path="rhu-doctor">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="telemedicine" element={<Appointments />}></Route>
				<Route
					path="patient-queue"
					element={<DoctorPatientQueue />}
				></Route>
				<Route
					path="patient-referrals"
					element={<DoctorPatientReferrals />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>
			<Route path="his-doctor">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="telemedicine" element={<Appointments />}></Route>
				<Route
					path="patient-queue"
					element={<DoctorPatientQueue />}
				></Route>
				<Route
					path="patient-referrals"
					element={<DoctorPatientReferrals />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>
			<Route path="his-laboratory">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route
					path="patient-lab-queue"
					element={<PatientLabQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>
			<Route path="his-xray">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route
					path="patient-lab-queue"
					element={<PatientLabQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>
			<Route path="his-cashier">
				<Route path="" element={<Dashboard />}></Route>
				<Route
					path="patient-cashier-queue"
					element={<PatientCashierQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="rhu-pharmacy">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="consignments" element={<Consignments />}></Route>
				<Route path="inventory" element={<Inventories />}></Route>

				<Route
					path="patient-pharmacy-queue"
					element={<PatientPharmacyQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="rhu-admin">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="rhu-list" element={<RHULists />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="personnels" element={<RHUPersonnels />}></Route>
				<Route
					path="doctor-specialties"
					element={<DoctorSpecialties />}
				></Route>
				<Route path="rooms" element={<RHURooms />}></Route>
				<Route
					path="laboratory-tests"
					element={<LaboratoryTests />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>
			
			<Route path="his-anesthesia">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route path="patient-anesthesia-queue" element = {<PatientAnestesiaQueue />}></Route>
				<Route path="inventory" element = {<Inventory />}></Route>
			</Route>

			<Route path="his-monitoring">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patient-monitoring" element = {<PatientMonitoring />}></Route>
			</Route>

			<Route path="rhu-nurse">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="telemedicine" element={<Appointments />}></Route>
				<Route path="patient-queue" element={<PatientQueue />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="his-er">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="er-queue" element={<PatientERQueue />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
				{/* <Route path="inventory" element = {<Inventory />}></Route> */}
			</Route>

			<Route path="his-opd-infectious">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route path="opd-infectious-queue" element = {<PatientOPDInfectiousQueue />}></Route>
				<Route path="inventory" element = {<Inventory />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="his-delivery">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route path="patient-delivery-queue" element = {<PatientDeliveryQueue />}></Route>
				<Route path="inventory" element = {<Inventory />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="icu-nurse">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="icu-nurse-queue" element = {<ICUNurseQueue />}></Route>
				<Route path="inventory" element = {<Inventory />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="his-pharmacy">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="consignments" element={<Consignments />}></Route>
				<Route path="inventory" element={<Inventories />}></Route>

				<Route
					path="patient-pharmacy-queue"
					element={<PatientPharmacyQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>
			
			<Route path="*" element={<Error404 />}></Route>
		</Route>
	)
);
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;



const AppMain = (props) => {


	const [online, setOnline] = useState(navigator.onLine);
	const [token, setToken] = useState("");

	useEffect(() => {
		const handleStorageChange = (event) => {
			// Check if the storage event was triggered by a change in the specific item we are interested in
			if (event.key === 'token') {
				setToken(event.token);
			}
		  };
		  window.addEventListener('storage', handleStorageChange);
		  const storedData = localStorage.getItem('token');
		  if (storedData) {
			setToken(storedData);
		  }

		  return () => {
			window.removeEventListener('storage', handleStorageChange);
		  };
	},[]);
	useEffect(() => {
		console.log('Online', navigator.onLine);
		
	},[online,token]);

	return props.children;


}
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AppMain>
			<RouterProvider router={router} />
		</AppMain>
	</React.StrictMode>
);
