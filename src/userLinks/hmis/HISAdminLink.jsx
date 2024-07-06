import React from 'react'
import MenuLink from '../../components/buttons/MenuLink';

const HISAdminLink = ({ isActive }) => {
  return (
    <>
			<span className="text-xs font-light text-white	pt-3 pb-1 px-2 w-full border-t border-t-black border-opacity-10">
				Main Menu
			</span>
			<MenuLink
				to={``}
				active={isActive(``)}
				icon="rr-dashboard"
				text="Dashboard"
			/>
			{/* <MenuLink
				to="/patients"
				active={isActive("/patients")}
				icon="rr-users"
				text="Patients"
			/>
			<MenuLink
				to="/patient-queue"
				active={isActive("/patients-queue")}
				icon="rr-clipboard-list-check"
				text="Patient Queue"
			/> */}
			{/* rhu-list
            personnels
            doctor-specialties
            rooms */}

			<MenuLink
				to="/rhu-list"
				active={isActive("/rhu-list")}
				icon="rr-building"
				text="RHU Lists"
			/>

			<MenuLink
				to="/personnels"
				active={isActive("/personnels")}
				icon="rr-users"
				text="RHU Personnels"
			/>

			<MenuLink
				to="/rooms"
				active={isActive("/rooms")}
				icon="rr-bed"
				text="RHU Rooms"
			/>
			<MenuLink
				to="/laboratory-tests"
				active={isActive("/laboratory-tests")}
				icon="rr-microscope"
				text="Laboratory Tests"
			/>
			<MenuLink
				to="/doctor-specialties"
				active={isActive("/doctor-specialties")}
				icon="rr-trophy"
				text="Doctor Specialties"
			/>
		</>
	);
};

export default HISAdminLink