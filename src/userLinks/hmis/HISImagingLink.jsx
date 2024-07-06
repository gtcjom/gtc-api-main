import React from 'react'
import useLabQueue from '../../hooks/useLabQueue';
import MenuLink from '../../components/buttons/MenuLink';

const HISImagingLink = ({ isActive }) => {
    const { pending } = useLabQueue();
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
				to="/patient-lab-queue"
				active={isActive("/patient-lab-queue")}
				icon="rr-clipboard-list-check"
				text="Patient Queue"
				counter={pending?.data?.length}
			/>
		</>
	);
};

export default HISImagingLink