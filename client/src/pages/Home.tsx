import './Home.scss';
import InvoiceInfoBar from '../components/InvoiceInfoBar.tsx';
import Error from './Error.tsx';
import empty from '../assets/illustration-empty.svg';
import useInvoice from '../store/useInvoice.tsx';
import useInvoiceForm from '../store/useInvoiceForm.tsx';
import useIsMobile from '../hooks/useIsMobile.tsx';
import DropdownMenu from '../components/DropdownMenu.tsx';

const Home: React.FC = () => {
  const { invoices, filterByStatus } = useInvoice();
  const { toggleInvoiceForm, resetInvoiceForm, setEditInvoice } = useInvoiceForm();
  const { isMobile } = useIsMobile();

  const renderedInvoices = invoices.map((invoice) => {
    return <InvoiceInfoBar invoice={invoice} key={invoice.id} />;
  });

  return (
    <div className="home page">
      <div className="container">
        <header>
          <div className="number-of-invoices">
            <h2>Invoice</h2>
            <p>{`${!isMobile ? 'There are' : ''} ${invoices.length || 'no'} invoices`}</p>
          </div>
          <DropdownMenu
            menuNameFull="Filter by status"
            menuMobilName="Filter"
            menuOptions={['draft', 'pending', 'paid']}
            dispatchFunc={filterByStatus}
          />
          <button
            className="create-invoice"
            onClick={() => {
              resetInvoiceForm();
              setEditInvoice(false);
              toggleInvoiceForm();
            }}
          >
            <div className="icon"></div>
            <p>{!isMobile ? 'New Invoice' : 'Invoice'}</p>
          </button>
        </header>
        <div className="invoices">
          {invoices.length > 0 ? (
            renderedInvoices
          ) : (
            <Error
              title="There is nothing here"
              description="Create an invoice by clicking the New Invoice button and get started"
              illustration={empty}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
