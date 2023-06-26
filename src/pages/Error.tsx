import NavigateBackBtn from '../components/NavigateBackBtn';
import './Error.scss';
import React from 'react';

interface Props {
  title?: string;
  description?: string;
  illustration?: string;
  backToHomepageBtn?: boolean;
}

const Error: React.FC<Props> = ({ title, description, illustration, backToHomepageBtn }) => {
  return (
    <div className="error">
      {backToHomepageBtn && <NavigateBackBtn path={'/'} />}
      <h1 className="title">{title}</h1>
      <p className="description">{description}</p>
      <img className="illustration" src={illustration} alt={title} />
    </div>
  );
};

export default Error;
