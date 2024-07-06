import React from 'react'
import useDeliveryQueue from '../../hooks/useDeliveryQueue';
import MenuLink from '../../components/buttons/MenuLink';

const HISDeliveryLink = ({isActive}) => {
    const { pending, pendingForRelease } = useDeliveryQueue();
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
                  to="/patient-delivery-queue"
                  active={isActive("/patient-delivery-queue")}
                  icon="rr-clipboard-list-check"
                  text="Patient Queue"
                  counter={
                      parseInt(pending?.data?.length || 0) +
                      parseInt(pendingForRelease?.data?.length || 0)
                  }
              />
              {/* <MenuLink
                  to="/er-queue"
                  active={isActive("/er-queue")}
                  icon="rr-clipboard-list-check"
                  text="Patient Queue"
                  counter={
                      parseInt(pending?.data?.length || 0) +
                      parseInt(pendingForRelease?.data?.length || 0)
                  }
              /> */}
              {/* <MenuLink
                  to="/inventory"
                  active={isActive("/inventory")}
                  icon="rr-clipboard-list-check"
                  text="Inventory"
              />  */}
      </>
    )
}

export default HISDeliveryLink