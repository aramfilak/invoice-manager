import './DropdownMenu.scss';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from '../assets/appIcons.tsx';
import useIsMobile from '../hooks/useIsMobile.tsx';

interface Props {
  menuNameFull: string;
  menuMobilName: string;
  menuOptions: string[];
  dispatchFunc: (option: any) => void;
}
const DropdownMenu: React.FC<Props> = ({
  menuNameFull,
  menuMobilName,
  menuOptions,
  dispatchFunc,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowFilterOptions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const renderedOptions = menuOptions.map((option, idx) => (
    <li key={idx}>
      <input
        className="menu-option"
        id={`option__${idx}`}
        type="checkbox"
        checked={selectedOption === option}
        onChange={() => {
          setSelectedOption(option);
          dispatchFunc(option);
        }}
      />
      <label htmlFor={`option__${idx}`}>{option}</label>
    </li>
  ));

  return (
    <div className="dropdown-menu" ref={menuRef}>
      <button
        type="button"
        className={`dropdown-btn ${showFilterOptions ? 'open' : 'close'}`}
        onClick={() => setShowFilterOptions(!showFilterOptions)}
      >
        {selectedOption || (isMobile ? menuMobilName : menuNameFull)}
        <ArrowDown />
      </button>
      <ul className={`menu-options ${showFilterOptions ? 'open' : 'close'}`}>{renderedOptions}</ul>
    </div>
  );
};

export default DropdownMenu;
