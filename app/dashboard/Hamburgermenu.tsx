import React,{useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
  options: string[];
  selected: number;
  setSelected: (index: number) => void;
}

const HamburgerMenu: React.FC<Props> = ({ options, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <button onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
      </button>

      {isOpen && (
        <ul className="bg-white text-black space-y-2">
          {options.map((option, index) => (
            <li
              key={index}
              className={`cursor-pointer hover:text-dseublue ${selected === index ? "text-dseublue" : ""}`}
              onClick={() => setSelected(index)}
            >
              <strong>{option}</strong>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default HamburgerMenu;