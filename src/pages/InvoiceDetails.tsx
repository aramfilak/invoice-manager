import './InvoiceDetails.scss';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Error from './Error';
import pageNotFound from '../assets/page-not-found.svg';
import NavigateBackBtn from '../components/NavigateBackBtn';
import ConfirmDeletionMsg from '../components/DeletionMsg';
import { toast } from 'react-toastify';
import useInvoice from '../store/useInvoice';
import useInvoiceForm from '../store/useInvoiceForm';

const InvoiceDetails: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { deleteInvoice, invoices, markInvoiceAsPaid } = useInvoice();
  const { updateInvoiceFormValue, setEditInvoice, toggleInvoiceForm } = useInvoiceForm();
  const invoice = invoices.find((invoice) => invoice.id === params.invoiceId);
  const [showDeletionMsg, setShowDeletionMsg] = useState<boolean>(false);
  if (!invoice) {
    return (
      <Error
        title="Page not found :("
        description="The page you are looking for may have been moved, delete, or possibly never existed."
        illustration={pageNotFound}
        backToHomepageBtn
      />
    );
  }

  const {
    id,
    description,
    senderAddress,
    createdAt,
    paymentDue,
    clientAddress,
    clientName,
    clientEmail,
    total,
    items,
    status,
  } = invoice;

  const handleInvoiceDeletion = () => {
    setShowDeletionMsg(false);
    deleteInvoice(id);
    navigate('/');
    toast.error(`#${id} deleted`);
  };

  const handleMarkInvoiceAsPaid = () => {
    if (status === 'draft') {
      return toast.warn(
        'Your Invoice is not fully filled out.\n Please fill it out in the edit mode'
      );
    }
    markInvoiceAsPaid(id);
    toast.success(`#${id} marked as paid`);
  };

  const handleEditInvoice = () => {
    updateInvoiceFormValue(invoice);
    toggleInvoiceForm();
    setEditInvoice(true);
  };

  return (
    <div className="invoice page">
      {showDeletionMsg && (
        <ConfirmDeletionMsg
          invoiceID={`#${id}`}
          deleteFunc={handleInvoiceDeletion}
          cancelFunc={() => setShowDeletionMsg(false)}
        />
      )}
      <div className="container">
        <NavigateBackBtn path="/" />
        <header className="info-bar el">
          <p style={{ color: '#858BB2' }}>Status</p>
          <div className={`status ${status}`}>{status}</div>
          <div className="tools">
            <button className="edit-btn" onClick={handleEditInvoice}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => setShowDeletionMsg(true)}>
              Delete
            </button>
            {status !== 'paid' && (
              <button className="marks-as-paid-btn" onClick={handleMarkInvoiceAsPaid}>
                Mark as Paid
              </button>
            )}
          </div>
        </header>
        <div className="invoice-details el">
          <div className="head">
            <div className="id">
              <p className="st">
                <span className="nr">#</span>
                {id}
              </p>
              <p className="nr">{description}</p>
            </div>

            <div className="sender-address nr">
              <p className="street nr">{senderAddress.street}</p>
              <p className="city nr">{senderAddress.city}</p>
              <p className="post-code nr">{senderAddress.postCode}</p>
              <p className="country nr">{senderAddress.country}</p>
            </div>
          </div>
          <div className="body">
            <div className="dates">
              <div className="invoice-date nr">
                <p className="title nr mb">Invoice Date</p>
                <p className="date st">
                  {`${new Date(createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}`}
                </p>
              </div>
              <div className="payment-due">
                <p className="title nr mb">Payment Due</p>
                <p className="date st">
                  {`${new Date(paymentDue).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}`}
                </p>
              </div>
            </div>
            <div className="bill-to">
              <p className="nr">Bill to</p>
              <div className="client-name st mb">{clientName}</div>
              <div className="client-address nr">
                <p className="street nr">{clientAddress.street}</p>
                <p className="city nr">{clientAddress.city}</p>
                <p className="postCode nr">{clientAddress.postCode}</p>
                <p className="country nr">{clientAddress.country}</p>
              </div>
            </div>
            <div className="sent-to">
              <div className="title nr mb">Sent to</div>
              <div className="client-email st">{clientEmail}</div>
            </div>
          </div>
          <div className="items">
            {items.map((items, idx) => {
              return (
                <div key={idx} className="item">
                  <div className="quantity nr">
                    <div className="name st"> {items.name}</div>
                    {`${items.quantity} x £ ${Number(items.price).toFixed(2)}`}
                  </div>
                  <div className="total st"> {`£ ${Number(items.total).toFixed(2)}`}</div>
                </div>
              );
            })}
          </div>
          <footer className="amount">
            <div className="title">Grand Total</div>
            <div className="total">{`£ ${Number(total).toFixed(2)}`}</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
