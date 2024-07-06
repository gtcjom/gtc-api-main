import React from 'react'
import useDoctorQueue from '../../hooks/useDoctorQueue';
import MenuLink from '../../components/buttons/MenuLink';
import useReferralQueue from '../../hooks/useReferralQueue';

const HISDoctorLink = ({ isActive }) => {
    const { pending } = useDoctorQueue();
	const { pending: referralsPending, pendingPrescription } =
		useReferralQueue();
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
			<MenuLink
				to="/patients"
				active={isActive("/patients")}
				icon="rr-users"
				text="Patients"
			/>

			<MenuLink
				to="/telemedicine"
				active={isActive("/telemedicine")}
				icon="rr-wifi"
				text="TeleMedicine"
			/>
			<MenuLink
				to="/patient-queue"
				active={isActive("/patient-queue")}
				icon="rr-clipboard-list-check"
				text="Patient Queue"
				counter={pending?.data?.length}
			/>
			<MenuLink
				to="/patient-referrals"
				active={isActive("/patient-referrals")}
				icon="rr-chart-user"
				text="Patient Referrals"
				counter={
					parseInt(referralsPending?.data?.length) +
					parseInt(pendingPrescription?.data?.length)
				}
			/>
			{/* <MenuLink
				to="/teleconsult"
				active={isActive("/patient-queue")}
				icon="rr-clipboard-list-check"
				text="Tele-consult"
				// counter={pending?.data?.length}
			/> */}
		</>
	);
};

export default HISDoctorLink