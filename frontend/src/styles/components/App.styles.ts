import { colors } from '../globals';

export const screenStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px'
};

export const titleStyle: React.CSSProperties = {
    color: colors.text,
    marginBottom: '10px'
};

export const statusStyle: React.CSSProperties = {
    marginBottom: '30px',
    fontSize: '16px'
};

export const buttonContainerStyle: React.CSSProperties = {
    marginTop: '30px'
};

export const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    margin: '10px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '200px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
};

export const buttonDisabledStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: colors.secondary,
    cursor: 'not-allowed'
};

export const buttonBackStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: colors.secondary
};

export const inputStyle: React.CSSProperties = {
    padding: '10px',
    fontSize: '16px',
    margin: '10px',
    width: '200px',
    borderRadius: '5px',
    border: `1px solid ${colors.border}`,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
};

export const gameStatusStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '20px 0',
    color: colors.text
};