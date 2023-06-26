import './NavigateBackBtn.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '../assets/appIcons';

interface Props {
  path: string;
}

const NavigateBackBtn: React.FC<Props> = ({ path }) => {
  const navigate = useNavigate();
  return (
    <button className="back-home-btn" onClick={() => navigate(path)}>
      <ArrowLeft />
      <p className="btn-name"> Go Back</p>
    </button>
  );
};

export default NavigateBackBtn;
