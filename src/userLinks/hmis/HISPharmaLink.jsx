import React from 'react'
import usePharmaQueue from '../../hooks/usePharmaQueue';
import MenuLink from '../../components/buttons/MenuLink';

const HISPharmaLink = ({ isActive }) => {
    const { pending, pendingMedsRelease } = usePharmaQueue();
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
				to="/patient-pharmacy-queue"
				active={isActive("/patient-pharmacy-queue")}
				icon="rr-clipboard-list-check"
				text="Patient Queue"
				counter={
					parseInt(pending?.data?.length) +
					parseInt(pendingMedsRelease?.data?.length)
				}
			/>
			<MenuLink
				to="/consignments"
				active={isActive("/consignments")}
				icon="rr-truck-side"
				text="Consignments"
			/>
			<MenuLink
				to="/inventory"
				active={isActive("/inventory")}
				icon="rr-boxes"
				text="Inventory"
			/>
		</>
	);
};

export default HISPharmaLink