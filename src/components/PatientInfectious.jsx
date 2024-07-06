import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import useNoBugUseEffect from '../hooks/useNoBugUseEffect';
import ContentTitle from './buttons/ContentTitle';
import ActionBtn from './buttons/ActionBtn';
import FlatIcon from './FlatIcon';
import UpdateOutPatientInfectionModal from './modal/UpdateOutPatientInfectionModal';
import Axios from '../libs/axios';

const PatientInfectious = (props) => {
  const {
    patient,
    appointment,
    showTitle = true,
    mutateAll,
    onSuccess,
  } = props;
  const {
    register,
    formState: { errors },
} = useForm();
const [infections, setInfections] = useState([]);
  const [loading, setLoading] = useState(true);
  const updateInfectionsRef = useRef(null);

  useNoBugUseEffect({
    functions: () => {
      if (patient?.id) getOutPatientInfections(patient);
    },
    params: [patient?.id],
  });

  const getOutPatientInfections = (patientData) => {
    setLoading(true);
    Axios.get(`v1/patient-infections/infections/${patientData?.id}`)
      .then((res) => {
        setInfections(res.data.data || []);
        if (onSuccess) {
          onSuccess(res.data.data);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  };

  return (
    <div className="flex flex-col items-start">
      {showTitle ? (
        <ContentTitle title="Patient Infections">
          {/* <ActionBtn
            size="sm"
            onClick={() => {
              updateInfectionsRef.current.show(patient, appointment);
              // setUpdate(true);
            }}
          >
            <FlatIcon icon="rr-edit" className="mr-1" />
            Update Infections
          </ActionBtn> */}
        </ContentTitle>
      ) : (
        <div className="flex items-center gap-4 pb-2">
          {infections?.updated_at ? (
            <>
              <span className="text-base">
                Last updated{' '}
                {infections?.updated_at
                  ? formatDateMMDDYYYYHHIIA(new Date(infections?.updated_at))
                  : ''}
              </span>
              {/* <ActionBtn
                            size="sm"
                            onClick={() => {
                                updateInfectionRef.current.show(
                                    patient,
                                    appointment
                                );
                                // setUpdate(true);
                            }}
                        >
                            <FlatIcon icon="rr-edit" className="mr-1" />
                            Update Infections
                        </ActionBtn> */}
            </>
          ) : (
            ''
          )}
        </div>
      )}
      {/* {loading ? (
        <div className="p-5 flex items-center justify-center w-full">
          <h2 className="text-2xl font-bold animate-pulse flex items-center gap-2">
            <span className="flex items-center justify-center animate-spin">
              <FlatIcon icon="rr-loading" />
            </span>
            Loading...
          </h2>
        </div>
      ) :  */}
      {infections.length > 0 ? (
        <div className="flex items-start justify-start flex-wrap gap-6 pb-11 w-full px-0">
          {infections.map((infection, index) => (
            <Card
              key={index}
              color="red"
              title={infection.name}
              icon="infection"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{infection.description}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 px-5 w-full">
          <span className="">
            No patient infections record found. <br />
            Click on "<b>Update Infections</b>" to update.
          </span>
          <ActionBtn
            size="lg"
            onClick={() => {
              updateInfectionsRef.current.show(patient, appointment);
              // setUpdate(true);
            }}
          >
            <FlatIcon icon="rr-edit" className="mr-1" />
            Update Infections
          </ActionBtn>
        </div>
      )}
      <UpdateOutPatientInfectionModal
        ref={updateInfectionsRef}
        onSuccess={(data) => {
          console.log('onSuccess', getPatientInfections(patient));
          if (mutateAll) mutateAll();
          if (onSuccess) onSuccess(data);
        }}
      />
    </div>
  );
}

export default PatientInfectious