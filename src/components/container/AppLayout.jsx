import { Link, useLocation, useNavigation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../layout/Header";
import FlatIcon from "../FlatIcon";
import MenuLink from "../buttons/MenuLink";
import { useEffect, useRef, useState } from "react";
import Img from "../Img";
import { ToastContainer } from "react-toastify";
import ConfirmLogoutModal from "../modal/ConfirmLogoutModal";
import RHUNurseLinks from "../../userLinks/RHUNurseLinks";
import RHUDoctorLinks from "../../userLinks/RHUDoctorLinks";
import RHUAdminLinks from "../../userLinks/RHUAdminLinks";
import RHULabLinks from "../../userLinks/RHULabLinks";
import RHUImagingLinks from "../../userLinks/RHUImagingLinks";
import useReValidateAuth from "../../hooks/useReValidateAuth";
import RHUPharmaLinks from "../../userLinks/RHUPharmaLinks";
import useNoBugUseEffect from "../../hooks/useNoBugUseEffect";
import { detectMobile } from "../../libs/helpers";
import RHUCashierLinks from "../../userLinks/RHUCashierLinks";
import HISAdminLink from "../../userLinks/hmis/HISAdminLink";
import HISAnesthesiaLink from "../../userLinks/hmis/HISAnesthesiaLink";
import HISAnesthesiaMonitorLink from "../../userLinks/hmis/HISAnesthesiaMonitorLink";
import HISCashierLink from "../../userLinks/hmis/HISCashierLink";
import HISDoctorLink from "../../userLinks/hmis/HISDoctorLink";
import HISErLink from "../../userLinks/hmis/HISErLink";
import HISImagingLink from "../../userLinks/hmis/HISImagingLink";
import HISLabLinks from "../../userLinks/hmis/HISLabLinks";
import HISNurseLink from "../../userLinks/hmis/HISNurseLink";
import HISPharmalink from "../../userLinks/hmis/HISPharmaLink";
import HISDeliveryLink from "../../userLinks/hmis/HISDeliveryLink";
import HISOPDInfectiousLink from "../../userLinks/hmis/HISOPDInfectiousLink";
import HISICUNurseLink from "../../userLinks/hmis/HISICUNurseLink";
import HISOPDNurseLink from "../../userLinks/hmis/HISOPDNurseLink";

const AppLayout = (props) => {
	useReValidateAuth();
	const confirmLogoutRef = useRef(null);
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const { user, logout } = useAuth({
		middleware: "auth",
		redirectIfAuthenticated: "/",
	});
	const { children } = props;
	const isActive = (name) => {
		if (name == "") {
			return location?.pathname == `/${String(user?.type).toLowerCase()}`;
		}
		return location?.pathname?.includes(name);
	};
	useNoBugUseEffect({
		functions: () => {
			// if (window) {
			// 	window.onresize = (event) => {
			// 		console.log("TEST", detectMobile());
			// 	};
			// }
			setIsMobile(detectMobile());
		},
		params: [],
	});
	const renderLinks = () => {
		switch (String(user?.type).toLowerCase()) {
			case "rhu-nurse":
				return <RHUNurseLinks isActive={isActive} />;

			case "rhu-doctor":
				return <RHUDoctorLinks isActive={isActive} />;

			case "his-nurse":
				return <HISNurseLink isActive={isActive} />;

			case "his-doctor":
				return <HISDoctorLink isActive={isActive} />;

			case "his-laboratory":
				return <HISLabLinks isActive={isActive} />;

			case "his-xray":
				return <HISImagingLink isActive={isActive} />;

			case "his-cashier":
				return <HISCashierLink isActive={isActive} />;

			case "his-pharmacy":
			case "rhu-pharmacy":
				return <HISPharmalink isActive={isActive} />;

			case "his-admin":
				return <HISAdminLink isActive={isActive} />;

			case "his-monitoring":
				return <HISAnesthesiaMonitorLink isActive={isActive} />;

			case "his-anesthesia":
				return <HISAnesthesiaLink isActive={isActive} />;
				
			case "his-er":
				return <HISErLink isActive={isActive} />;

			case "his-opd-infectious":
			return <HISOPDInfectiousLink isActive={isActive} />;

			case "his-delivery":
				return <HISDeliveryLink isActive={isActive} />;

			case "icu-nurse":
				return <HISICUNurseLink isActive={isActive} />;

			case "his-md":
				return <HISMDLink isActive={isActive} />;

			case "his-opd-nurse":
				return <HISOPDNurseLink isActive={isActive} />;

			default:
				break;
		}
	};
	return (
		<div className="w-full flex">
			{/* <span
				className={`absolute z-30 top-[10px] duration-200 cursor-pointer lg:hidden shadow shadow-blue-500 rounded bg-white h-8 w-8 flex items-center justify-center ${
					sidebarOpen ? "left-[244px]" : "left-[12px] rotate-180"
				}`}
				onClick={() => {
					setSidebarOpen((prevOpen) => !prevOpen);
				}}
			>
				<FlatIcon
					icon="rr-arrow-left-from-line"
					className="text-blue-500 text-xs -mt-[-2px]"
				/>
			</span> */}
			<div>
				<div
					className={`absolute lg:relative  duration-200 h-[100dvh] border-r-[0.1px] lg:!border-r-[0px] shadow-white lg:!left-0 w-[256px] z-20 bg-blue-600 ${
						!sidebarOpen ? "left-[-256px]" : "left-0"
					}`}
				>
					<div className="h-[60px] z-20 bg-black bg-opacity-20 flex items-center relative pl-4 justify-center">
						<Link to="/" className=" cursor-pointer w-full">
							<div className="h-[44px]  flex items-center gap-4">
								<img
									src="/logo.png"
									alt="logo"
									className="h-[40px] w-[40px] rounded-full"
								/>
								<span
									className="text-3xl font-semibold text-white tracking-wider"
									// style={{ textShadow: "1px 1px 2px black" }}
								>
									GTC HIS
								</span>
							</div>
						</Link>
						{detectMobile() && sidebarOpen ? (
							<span
								className="bg-indigo-900 text-xm flex items-center p-2 justify-center -mr-3 text-white rounded-lg shadow-md"
								onClick={() => {
									setSidebarOpen(false);
								}}
							>
								<FlatIcon icon="rr-angle-double-left" />
							</span>
						) : (
							""
						)}
					</div>
					<div className="flex flex-col z-20">
						<div className="flex flex-col h-[calc(100dvh-84px)]">
							<div className="mb- flex ml- justify-start items-center gap-2 bg-primary-dark bg-opacity-10 px-3 py-6">
								<Img
									src={user?.avatar}
									type="user"
									name={user?.name}
									className="h-10 w-10 rounded border border-white"
								/>
								<div className="flex flex-col">
									<span className="text-md border-b border-b-blue-300 font-light font-opensans mb-1 text-white">
										{user?.name}
									</span>
									<span className="text-[10px] font-light text-white">
										{user?.type}
									</span>
								</div>
							</div>
							{renderLinks()}
							<span className="text-xs font-light text-white pt-3 pb-1 px-2  w-full">
								My Account
							</span>

							<MenuLink
								to="/my-account"
								active={isActive("/my-account")}
								icon="rr-user"
								text="My Account"
							/>

							<MenuLink
								to="/logout"
								active={isActive("/logout")}
								onClick={async (e) => {
									await e.preventDefault();
									await e.stopPropagation();
									// await logout();
									confirmLogoutRef.current.show();
								}}
								icon="rr-sign-out-alt"
								text="Logout"
							/>
						</div>
						<div className="flex items-center mt-auto justify-center pb-2">
							<span className="text-white font-roboto text-xs font-light">
								POWERED BY GTC <b>&nbsp;© 2024</b>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="relative bg-white bg-opacity-80 h-[100dvh] w-full lg:w-[calc(100vw-257px)] ">
				<Header
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>
				<div className="overflow-auto  relative h-[calc(100vh-64px)]">
					{children}
				</div>
			</div>
			<ToastContainer theme="colored" />
			<ConfirmLogoutModal logout={logout} ref={confirmLogoutRef} />
		</div>
	);
};

export default AppLayout;
