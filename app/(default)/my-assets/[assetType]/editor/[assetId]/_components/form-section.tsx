import React from 'react';


interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = (props) => {
  return (
    <div className='rounded-xl overflow-hidden border border-border'>
      <div className='bg-muted font-jura font-bold py-2 px-4'>
        <h3
          className='text-sm uppercase tracking-wide '
        >
          {props.title}
        </h3>
      </div>
      <div className='py-4 px-4 space-y-6'>
        {props.children}
      </div>
    </div>
  )
};

export default FormSection;
