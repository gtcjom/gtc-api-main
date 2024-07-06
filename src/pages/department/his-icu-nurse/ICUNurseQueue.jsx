import React, { useRef, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth';
import useDataTable from '../../../hooks/useDataTable';
import useDoctorQueue from '../../../hooks/useDoctorQueue';
import useOPDInfectiousQueue from '../../../hooks/useOPDInfectiousQueue';
import useNoBugUseEffect from '../../../hooks/useNoBugUseEffect';
import AppLayout from '../../../components/container/AppLayout';
import InQueueRegular from '../../patient-queue/components/InQueueRegular';
import InQueueForRelease from '../../patient-queue/components/InQueueForRelease';
import ActionBtn from '../../../components/buttons/ActionBtn';
import TabGroup from '../../../components/TabGroup';
import MenuTitle from '../../../components/buttons/MenuTitle';
import PatientInfectious from '../../../components/PatientInfectious';
import PatientTreatment from '../../../components/PatientTreatment';
import PatientProfileDetails from '../../../components/PatientProfileDetails';
import PatientAppointments from '../../../components/PatientAppointments';
import PatientVitals from '../../../components/PatientVitals';
import PatientVitalCharts from '../../../components/PatientVitalCharts';
import LaboratoryResult from '../his-anesthesia/components/LaboratoryResult';
import ImagingResult from '../his-anesthesia/components/ImagingResult';
import PatientCSROrder from '../his-nurse/components/PatientCSROrder';
import PatientPharmacyOrder from '../his-nurse/components/PatientPharmacyOrder';
import PatientChartsAnesthesia from '../his-anesthesia/components/PatientChartsAnesthesia';
import AppointmentDetailsForNurse from '../../appointments/components/AppointmentDetailsForNurse';
import { Fade } from 'react-reveal';
import ReferToSPHModal from '../../../components/modal/ReferToSPHModal';
import InServiceOPDInfectious from '../../hims/his-opd-infectious/InServiceOPDInfectious';
import { patientFullName } from '../../../libs/helpers';
import PatientInfo from '../../patients/components/PatientInfo';
import InServiceICU from './InServiceICU';

const Status = ({ appointment }) => {
	const renderStatus = () => {
		if (appointment?.has_for_reading?.length > 0) {
			return (
				<span className="text-orange-500">
					Pending for Result Reading
				</span>
			);
		}
		if (appointment?.status == "pending" && appointment?.vital_id == null) {
			return (
				<span className="text-orange-500">
					Pending for patient vitals {appointment?.vital_id}
				</span>
			);
		}
		if (appointment?.status == "pending" && appointment?.vital_id != null) {
			return <span className="text-orange-600">Pending for service</span>;
		}
		if (
			appointment?.status == "pending-doctor-confirmation" &&
			appointment?.vital_id != null &&
			appointment?.referred_to != null
		) {
			return (
				<span className="text-orange-600">
					Pending for doctor&apos;s confirmation
				</span>
			);
		}
		if (
			appointment?.status == "pending-for-pharmacy-release" &&
			appointment?.prescribed_by == null
		) {
			return (
				<span className="text-orange-600">For Doctor Prescription</span>
			);
		}
		if (
			appointment?.status == "pending-for-pharmacy-release" &&
			appointment?.prescribed_by != null
		) {
			return (
				<span className="text-orange-600">For Medicine release</span>
			);
		}
		if (appointment?.status == "in-service-consultation") {
			return (
				<span className="text-orange-600">
					CONSULTATION WITH DOCTOR
				</span>
			);
		}
		return (
			<span className="text-red-600 uppercase">
				{String(appointment?.status).replaceAll("-", " ")}
			</span>
		);
	};
	return renderStatus();
};

const ICUNurseQueue = ({userRole}) => {
  // const { waitingRoom, mutateWaitingRoom, operatingRoom, mutateOperatingRoom, resu, mutateResu, done, mutateDone } = useAnesthesiaQueue();
  const [order, setOrder] = useState(null);
  // const {patient} = props;
  const { checkUserType } = useAuth();
  const createAppointmentRef = useRef(null);
  const privacyRef = useRef(null);
  const referToRHURef = useRef(null);
  const appointmentChoiceRef = useRef(null);
  const ERCareChoiceRef = useRef(null);
  const bookTeleMedicineRef = useRef(null);
  const operationProcedureRef = useRef(null);
  const operationDeliveryRef = useRef(null);
  const procedureChoiceRef = useRef(null);
  const [patientSelfie, setPatientSelfie] = useState(null);
  const { user } = useAuth();
  const {
      data: patients,
      setData: setPatients,
      loading,
      page,
      setPage,
      meta,
      filters,
      paginate,
      setPaginate,
      setFilters,
  } = useDataTable({
      url: `/v1/patients`,
  });
  const [patient, setPatient] = useState(null);
  const newPatientFormRef = useRef(null);
  const {
      pending: doctorsPending,
      nowServing: doctorsNowServing,
      mutatePending,
      mutatePendingForResultReading,
      mutateNowServing,
  } = useDoctorQueue();
  const {
      pending,
      pendingForRelease,
      mutatePendingForRelease,
      mutatePendingPatient,
      mutateNowServingPatient,
  } = useOPDInfectiousQueue();
  const referToSphModalRef = useRef(null);
  const [appointment, setAppointment] = useState(null);
  useNoBugUseEffect({
      functions: () => {setPaginate(10);},
  });

  const isDoctor = () => {
      return user?.type == "his-doctor" || user?.type == "HIS-DOCTOR";
  };

  const sortPendingList = (list) => {
      // Sort by priority: pending vitals first, then by id descending
      return (list || []).sort((a, b) => {
          if (a.status === "pending" && a.vital_id === null) return -1;
          if (b.status === "pending" && b.vital_id === null) return 1;
          return b.id - a.id;
      });
  };

  const listPending = () => {
      const pendingList = isDoctor() ? doctorsPending?.data : pending?.data;
      return sortPendingList(pendingList);
  };

  const sortedPendingForRelease = () => {
      return sortPendingList(pendingForRelease?.data);
  };

  const mutateAll = () => {
      mutatePending();
      mutatePendingForResultReading();
      mutateNowServing();
      mutatePendingForRelease();
      //mutatePendingPatient();
      //mutateNowServingPatient();
  };
  
  useNoBugUseEffect({
      functions: () => {},
  });
  const listPendingWaiting = () => {
      return waitingRoom?.data || [];
  };
  const listPendingOR = () => {
      return operatingRoom?.data || [];
  };
  const listPendingRESU = () => {
      return resu?.data || [];
  };
  const listPendingDone = () => {
      return done?.data || [];
  };

return (
  <AppLayout>
      {/* <PageHeader
          title="Patients"
          subtitle={`View patients`}
          icon="rr-users"
      /> */}
      
      <div className="p-4 h-full overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 divide-x">
              <div className="lg:col-span-4">
                  <h1 className="text-xl font-bold font-opensans text-primary-dark tracking-wider -mb-1">
                      Patient Queue
                  </h1>
                  <span className="noto-sans-thin text-slate-500 text-sm font-light">
                      Patients pending for service
                  </span>
                  <div className="flex flex-col gap-y-4 py-4">
                      {listPending()?.map((queue, index) => (
                          <InQueueRegular
                              referAction={() => {
                                  referToSphModalRef.current.show(queue);
                              }}
                              onClick={() => {
                                  if (queue.status != "pending-doctor-consultation") {
                                      setAppointment(queue.patient);
                                  } else {
                                      setAppointment(null);
                                  }
                              }}
                              selected={queue?.id == appointment?.id}
                              key={`iq2-${queue.id}`}
                              number={`${queue.id}`}
                              patientName={patientFullName(queue?.patient)}
                          >
                              <div className="w-full flex flex-col pl-16">
                                  <div className="flex items-center text-slate-700 gap-2 mb-2">
                                      <span className="text-sm">Status:</span>
                                      <span className="font-bold text-sm">
                                          <Status appointment={queue} />
                                      </span>
                                  </div>
                                  {/* I added a code */}
                                  {patients?.map((patientData) => (
                                  <PatientMenu
                                      onClick={() => {
                                          console.log("setPatient", patientData);
                                          setPatient(patientData);
                                      }}
                                      patient={patientData}
                                      active={patientData?.id === patient?.id}
                                      key={`patient-${patientData?.id}`}
                                  />
                                  ))}
                              </div>
                          </InQueueRegular>
                      ))}
                      {sortedPendingForRelease()?.map((queue, index) => (
                          <InQueueForRelease
                              selected={queue?.id == appointment?.id}
                              onClick={() => {
                                  setAppointment(queue);
                                  setPatient(queue.patient);
                              }}
                              key={`iqr-${queue.id}`}
                              number={`${queue.id}`}
                              patientName={patientFullName(queue?.patient)}
                          >
                              <div className="w-full flex flex-col pl-16">
                                  <div className="flex items-center text-slate-700 gap-2 mb-2">
                                      <span className="text-sm">Status:</span>
                                      <span className="font-bold text-sm text-red-600">
                                          {"PENDING FOR RELEASE"}
                                      </span>
                                  </div>
                              </div>
                          </InQueueForRelease>
                      ))}
                  </div>
              </div>
              <div className="lg:col-span-8 pl-4">
                  <div className="flex items-center">
                      <h1 className="text-xl font-bold font-opensans text-success-dark tracking-wider -mb-1">
                          In Service...
                      </h1>
                  </div>
                  <span className="mb-3 noto-sans-thin text-slate-500 text-sm font-light">
                      &nbsp;
                  </span>
                  <div>
                      {appointment?.patient ? (
                          <Fade key={`order-${appointment?.id}`}>
                              <div>
                                  <h4 className="border flex items-center text-base font-bold p-2 mb-0 border-indigo-100 lg:col-span-12">
                                      <span>Patient Information</span>
                                      <ActionBtn
                                          className="ml-auto"
                                          type="danger"
                                          onClick={() => {
                                              setAppointment(null);
                                          }}
                                      >
                                          Close
                                      </ActionBtn>
                                  </h4>
                                  <div className="flex flex-col lg:flex-row gap-2 border-x border-indigo-100 p-4">
                                      <PatientInfo patient={appointment?.patient} />
                                  </div>
                                  <div className="pb-4">
                                      <InServiceICU
                                          appointment={appointment}
                                          mutateAll={mutateAll}
                                          userRole={userRole}
                                          setOrder={(data) => {
                                              if (data == null) {
                                                  // mutateAll();
                                              }
                                              setAppointment(data);
                                          }}
                                      />
                                  </div>
                              </div>
                          </Fade>
                      ) : (
                          ""
                      )}
                  </div>
              </div>
          </div>
      </div>
      <ReferToSPHModal ref={referToSphModalRef} />
  </AppLayout>
  )
}

export default ICUNurseQueue