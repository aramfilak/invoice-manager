import './InvoiceInfoBar.scss';
import React from 'react';
import { Invoice } from '../../@types/invoice';
import { ArrowRight } from '../assets/appIcons';
import { useNavigate } from 'react-router-dom';

interface Props {
  invoice: Invoice;
}

const InvoiceInfoBar: React.FC<Props> = ({ invoice }) => {
  const { id, clientName, status, paymentDue, total } = invoice;
  const navigate = useNavigate();

  return (
    <div className="invoice-info-bar el" onClick={() => navigate(`/invoice/${id}`)}>
      <p className="id">
        <span>#</span>
        {id}
      </p>
      <p className="client">{clientName}</p>
      <p className="created-date">
        {`Due ${new Date(paymentDue).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}`}
      </p>
      <p className="total">{`£ ${Number(total)?.toFixed(2)}`}</p>
      <p className={`status ${status}`}>{status}</p>
      <ArrowRight />
    </div>
  );
};

export default InvoiceInfoBar;
