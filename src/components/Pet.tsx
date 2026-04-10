import React from 'react';
import { motion } from 'motion/react';
import { PetId, PetEquipped } from '../types';
import { CUSTOMIZATIONS } from '../constants';

interface PetProps {
  petId: PetId | null;
  equipped: PetEquipped;
  size?: number;
  className?: string;
}

const BioBlob = ({ color }: { color: string }) => (
  <g>
    <path fill={color} d="M87.7,63.4C96.2,52.3,95.2,36,85.5,26.2S65,13.7,53.8,22.2S39.1,43,47.6,54.1c4.5,5.8,11.3,9.5,18.8,9.5 C72,63.6,80.1,67.1,87.7,63.4z" />
    <path fill={color} d="M59,73.4c-5.4,6.7-15.3,8.9-24,4.2c-8.7-4.7-13.1-14.7-8.4-23.4s14.7-13.1,23.4-8.4C58.7,50.5,62.1,59,59,65.6 C57.8,67.7,57,70,59,73.4z" />
    <path fill={color} d="M32,77.3c-2.3,4.9-8.4,7.2-14.3,5.5c-5.9-1.7-9.9-7-8.2-12.9s7-9.9,12.9-8.2c2.4,0.7,4.4,2.2,5.5,4 C29.7,70.5,30.3,73.6,32,77.3z" />
    <circle fill="#FFFFFF" cx="65.3" cy="42.3" r="5.3" />
    <circle fill="#FFFFFF" cx="49.5" cy="71.8" r="3" />
    <circle fill="#000000" cx="67.2" cy="42.9" r="2.3" />
    <circle fill="#000000" cx="50.3" cy="72.2" r="1.3" />
  </g>
);

const RoboPup = ({ color }: { color: string }) => (
  <g>
    <rect x="25" y="40" fill="#B0BEC5" width="50" height="35" rx="5" />
    <rect x="30" y="45" fill={color} width="40" height="25" rx="3" />
    <rect x="20" y="30" fill="#CFD8DC" width="25" height="25" rx="5" />
    <circle fill="#455A64" cx="32.5" cy="42.5" r="5" />
    <circle fill="#FFFFFF" cx="32.5" cy="42.5" r="2" />
    <path fill="#78909C" d="M 45 30 L 50 20 L 55 30 Z" />
    <path fill="#78909C" d="M 70 40 L 80 35 L 80 45 Z" />
    <rect x="28" y="75" fill="#78909C" width="10" height="15" rx="3" />
    <rect x="62" y="75" fill="#78909C" width="10" height="15" rx="3" />
  </g>
);

const AstroCritter = ({ color }: { color: string }) => (
  <g>
    <circle fill={color} cx="50" cy="55" r="25" />
    <path fill="#CFD8DC" d="M 50 30 C 25 30, 25 50, 50 50 C 75 50, 75 30, 50 30 Z" />
    <circle fill="#263238" cx="40" cy="50" r="4" />
    <circle fill="#263238" cx="60" cy="50" r="4" />
    <path fill="none" stroke="#263238" strokeWidth="2" d="M 45 65 Q 50 70, 55 65" />
    <path fill="#FFD54F" d="M 20 55 A 40 40 0 0 1 80 55 A 45 20 0 0 1 20 55 Z" />
    <path fill="#FFCA28" d="M 25 55 A 30 30 0 0 1 75 55 A 35 15 0 0 1 25 55 Z" />
  </g>
);

const GeoGolem = ({ color }: { color: string }) => (
  <g>
    <path fill={color} d="M 25 90 L 20 50 L 40 40 L 60 40 L 80 50 L 75 90 Z" />
    <path fill="#9E9E9E" d="M 40 40 L 30 20 L 70 20 L 60 40 Z" />
    <path fill="#616161" d="M 45 20 L 55 20 L 55 10 L 45 10 Z" />
    <circle fill="#FAFAFA" cx="45" cy="55" r="5" />
    <circle fill="#FAFAFA" cx="55" cy="55" r="5" />
    <circle fill="#212121" cx="47" cy="55" r="2" />
    <circle fill="#212121" cx="53" cy="55" r="2" />
  </g>
);

const GogglesAccessory = () => (
  <g>
    <path fill="#455A64" d="M 25 35 C 20 35, 20 45, 25 45 L 35 45 C 40 45, 40 35, 35 35 Z" />
    <path fill="#455A64" d="M 65 35 C 60 35, 60 45, 65 45 L 75 45 C 80 45, 80 35, 75 35 Z" />
    <path fill="#78909C" d="M 30 38 C 28 38, 28 42, 30 42 L 30 42 C 32 42, 32 38, 30 38 Z" />
    <path fill="#78909C" d="M 70 38 C 68 38, 68 42, 70 42 L 70 42 C 72 42, 72 38, 70 38 Z" />
    <path d="M45 40 h10" stroke="#455A64" strokeWidth="2" />
  </g>
);

const BeanieAccessory = () => (
  <g transform="translate(0, -15) scale(1.2)">
    <path fill="#F57C00" d="M40,25 Q50,20 60,25 L55,15 L45,15 Z" />
    <path fill="#FF9800" d="M45,15 L55,15 L52,10 L48,10 Z" />
    <path d="M50,15 V5" stroke="#455A64" strokeWidth="1.5" />
    <path d="M45,5 h10" stroke="#455A64" strokeWidth="1.5" />
  </g>
);

const CapeAccessory = () => (
  <g transform="translate(0, 10)">
    <path fill="#D32F2F" d="M20,40 Q10,60 20,80 L80,80 Q90,60 80,40 Z" />
    <path fill="#B71C1C" d="M30,40 Q25,50 30,60 L70,60 Q75,50 70,40 Z" />
  </g>
);

export const Pet: React.FC<PetProps> = ({ petId, equipped, size = 100, className }) => {
  if (!petId) return <div style={{ width: size, height: size }} className="bg-slate-700 rounded-full animate-pulse" />;

  const colorData = CUSTOMIZATIONS.colors.find(c => c.id === equipped.color);
  const colorValue = colorData?.value || '#34d399';

  const renderPet = () => {
    switch (petId) {
      case 'bioBlob': return <BioBlob color={colorValue} />;
      case 'roboPup': return <RoboPup color={colorValue} />;
      case 'astroCritter': return <AstroCritter color={colorValue} />;
      case 'geoGolem': return <GeoGolem color={colorValue} />;
      default: return null;
    }
  };

  const renderAccessory = () => {
    switch (equipped.accessory) {
      case 'goggles': return <GogglesAccessory />;
      case 'beanie': return <BeanieAccessory />;
      case 'cape': return <CapeAccessory />;
      default: return null;
    }
  };

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
      className={className}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {renderPet()}
        {renderAccessory()}
      </svg>
    </motion.div>
  );
};
