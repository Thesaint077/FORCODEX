'use client';

import {useId, useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';

type Props = {name: string; label: string; defaultValue?: string | number; required?: boolean; placeholder?: string};
export function PasswordField({name, label, defaultValue = '', required = true, placeholder}: Props) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();
  return <div className="password-field">
    <label htmlFor={inputId}>{label}</label>
    <div className="password-input-wrap">
      <input id={inputId} name={name} type={visible ? 'text' : 'password'} defaultValue={defaultValue} required={required} placeholder={placeholder} autoComplete={label.includes('12 characters') ? 'new-password' : 'current-password'}/>
      <button type="button" className="password-toggle" aria-label={visible ? 'Hide password' : 'Show password'} aria-controls={inputId} aria-pressed={visible} onClick={() => setVisible(v => !v)}>
        {visible ? <EyeOff size={18} aria-hidden="true"/> : <Eye size={18} aria-hidden="true"/>}
        <span>{visible ? 'Hide' : 'Show'}</span>
      </button>
    </div>
  </div>;
}
