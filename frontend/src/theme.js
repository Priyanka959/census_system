import { createTheme } from '@mui/material/styles';

// ─── Color Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg:           '#F0F2EE',       // page background
  bgCard:       '#FFFFFF',       // card background
  bgDark:       '#1A1A1A',       // sidebar + chart cards
  bgDarkLight:  '#242424',       // chart inner background
  accent:       '#D4F53C',       // lime — primary accent
  accentDim:    'rgba(212,245,60,0.15)',
  accentGlow:   'rgba(212,245,60,0.3)',
  textPrimary:  '#111111',
  textSecond:   '#555555',
  textMuted:    '#999999',
  border:       '#E2E4DF',
  blue:         '#2979FF',
  coral:        '#FF4D6D',
  amber:        '#FFB800',
  shadow:       '0 2px 12px rgba(0,0,0,0.06)',
  shadowHover:  '0 8px 28px rgba(0,0,0,0.12)',
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: COLORS.bg,
      paper:   COLORS.bgCard,
    },
    primary: {
      main:          COLORS.accent,
      contrastText:  COLORS.textPrimary,
    },
    secondary: {
      main: COLORS.bgDark,
      contrastText: '#FFFFFF',
    },
    error: {
      main: COLORS.coral,
    },
    warning: {
      main: COLORS.amber,
    },
    info: {
      main: COLORS.blue,
    },
    text: {
      primary:   COLORS.textPrimary,
      secondary: COLORS.textSecond,
      disabled:  COLORS.textMuted,
    },
    divider: COLORS.border,
  },

  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"Orbitron", sans-serif', fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Orbitron", sans-serif', fontWeight: 800, letterSpacing: '-0.01em' },
    h3: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: '0.02em' },
    h4: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: '0.02em' },
    h5: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 600, letterSpacing: '0.03em' },
    h6: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 600, letterSpacing: '0.03em' },
    body1: { fontFamily: '"DM Sans", sans-serif', fontWeight: 400 },
    body2: { fontFamily: '"DM Sans", sans-serif', fontWeight: 400 },
    button: { fontFamily: '"DM Sans", sans-serif', fontWeight: 600, textTransform: 'none' },
    caption: { fontFamily: '"DM Sans", sans-serif' },
    overline: { fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.15em' },
  },

  shape: {
    borderRadius: 16,
  },

  components: {

    // ── CssBaseline ──
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box', margin: 0, padding: 0 },
        html: { scrollBehavior: 'smooth' },
        body: {
          backgroundColor: COLORS.bg,
          color:           COLORS.textPrimary,
          fontFamily:      '"DM Sans", sans-serif',
          minHeight:       '100vh',
          position:        'relative',
        },
        'body::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 600px 500px at 10% 20%,  rgba(212,245,60,0.6)  0%, transparent 70%),
            radial-gradient(ellipse 400px 400px at 85% 10%,  rgba(41,121,255,0.15) 0%, transparent 65%),
            radial-gradient(ellipse 350px 350px at 70% 80%,  rgba(255,77,109,0.3)  0%, transparent 60%),
            radial-gradient(ellipse 300px 300px at 5%  85%,  rgba(255,184,0,0.3)   0%, transparent 60%),
            radial-gradient(ellipse 500px 300px at 50% 50%,  rgba(212,245,60,0.2)  0%, transparent 70%)
          `,
          animation: 'orbDrift 18s ease-in-out infinite alternate',
          '@media (max-width: 599px)': {
            opacity: 0.7,
          },
        },
        '@keyframes orbDrift': {
          '0%':   { opacity: 1,    transform: 'scale(1)    translateY(0px)' },
          '50%':  { opacity: 0.85, transform: 'scale(1.04) translateY(-12px)' },
          '100%': { opacity: 1,    transform: 'scale(1)    translateY(0px)' },
        },
        '::-webkit-scrollbar': { width: '6px' },
        '::-webkit-scrollbar-track': { background: COLORS.bg },
        '::-webkit-scrollbar-thumb': {
          background:    '#C4C6C0',
          borderRadius:  '3px',
        },
        '::-webkit-scrollbar-thumb:hover': { background: COLORS.textMuted },
      },
    },

    // ── Button ──
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius:  '50px',
          padding:       '10px 24px',
          fontWeight:    600,
          fontSize:      '0.875rem',
          letterSpacing: '0.01em',
          transition:    'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow:     'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background:   COLORS.bgDark,
          color:        '#FFFFFF',
          '&:hover': {
            background: COLORS.accent,
            color: COLORS.textPrimary,
            transform: 'translateY(-2px)',
            boxShadow: COLORS.shadowHover,
          },
          '&:active': { transform: 'translateY(0)' },
        },
        containedSecondary: {
          background:   COLORS.bgDark,
          color:        '#FFFFFF',
          '&:hover': {
            background: '#333333',
            transform: 'translateY(-2px)',
            boxShadow: COLORS.shadowHover,
          },
        },
        containedError: {
          background: COLORS.coral,
          color: '#FFFFFF',
          '&:hover': {
            background: '#E03355',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(255,77,109,0.25)',
          },
        },
        outlinedPrimary: {
          borderColor: COLORS.border,
          color:       COLORS.textPrimary,
          '&:hover': {
            background:  COLORS.accentDim,
            borderColor: COLORS.accent,
          },
        },
        textPrimary: {
          color: COLORS.textSecond,
          '&:hover': { background: 'rgba(0,0,0,0.04)' },
        },
      },
    },

    // ── IconButton ──
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          transition:   'all 0.2s ease',
          color: COLORS.textMuted,
          '&:hover': {
            background: COLORS.accentDim,
            color: COLORS.textPrimary,
          },
        },
      },
    },

    // ── Card ──
    MuiCard: {
      styleOverrides: {
        root: {
          background:   COLORS.bgCard,
          borderRadius: '16px',
          boxShadow:    COLORS.shadow,
          border:       'none',
          backdropFilter: 'none',
        },
      },
    },

    // ── Paper ──
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background:       COLORS.bgCard,
          border:           'none',
          boxShadow:        COLORS.shadow,
        },
      },
    },

    // ── Dialog ──
    MuiDialog: {
      styleOverrides: {
        paper: {
          background:   COLORS.bgCard,
          border:       'none',
          boxShadow:    '0 24px 80px rgba(0,0,0,0.12)',
          borderRadius: '16px',
          backdropFilter: 'none',
        },
        backdrop: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter:  'blur(4px)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Syne", sans-serif',
          fontWeight: 700,
          fontSize:   '1.25rem',
          color:      COLORS.textPrimary,
          padding:    '24px 28px 16px',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 28px 24px',
          borderColor: COLORS.border,
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding:    '16px 28px 24px',
          borderTop:  `1px solid ${COLORS.border}`,
          gap:        '10px',
        },
      },
    },

    // ── TextField ──
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background:   '#F5F5F5',
          borderRadius: '10px',
          transition:   'all 0.2s ease',
          '& fieldset': { borderColor: 'transparent' },
          '&:hover fieldset': { borderColor: COLORS.border },
          '&.Mui-focused fieldset': {
            borderColor: COLORS.accent,
            boxShadow:   `0 0 0 3px ${COLORS.accentDim}`,
          },
          '&.Mui-error fieldset': {
            borderColor: COLORS.coral,
          },
          '& input': { color: COLORS.textPrimary },
          '& input::placeholder': { color: COLORS.textMuted, opacity: 1 },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: COLORS.textSecond,
          '&.Mui-focused': { color: COLORS.textPrimary },
          '&.Mui-error':   { color: COLORS.coral },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        icon: { color: COLORS.textSecond },
      },
    },

    // ── Menu (Select dropdown) ──
    MuiMenu: {
      styleOverrides: {
        paper: {
          background:  COLORS.bgCard,
          border:      `1px solid ${COLORS.border}`,
          borderRadius:'12px',
          boxShadow:   '0 12px 40px rgba(0,0,0,0.1)',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          color:        COLORS.textPrimary,
          fontSize:     '0.875rem',
          borderRadius: '8px',
          margin:       '2px 6px',
          '&:hover': { background: COLORS.accentDim },
          '&.Mui-selected': {
            background: COLORS.accentDim,
            color:      COLORS.textPrimary,
            fontWeight: 600,
            '&:hover':  { background: COLORS.accentDim },
          },
        },
      },
    },

    // ── Radio ──
    MuiRadio: {
      styleOverrides: {
        root: {
          color: COLORS.textMuted,
          '&.Mui-checked': { color: COLORS.bgDark },
        },
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.875rem',
          color:    COLORS.textSecond,
        },
      },
    },

    // ── Table ──
    MuiTableContainer: {
      styleOverrides: {
        root: {
          background:   COLORS.bgCard,
          borderRadius: '16px',
          boxShadow:    COLORS.shadow,
          border:       'none',
        },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: { background: 'transparent' },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            background:    '#F7F8F6',
            color:         COLORS.textMuted,
            fontFamily:    '"DM Sans", sans-serif',
            fontSize:      '0.7rem',
            fontWeight:    600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            borderBottom:  `1px solid ${COLORS.border}`,
            padding:       '14px 16px',
            whiteSpace:    'nowrap',
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background 0.15s ease',
            '&:hover': { background: '#F7F9F4' },
            '& .MuiTableCell-body': {
              borderBottom: `1px solid ${COLORS.border}`,
              color:        COLORS.textPrimary,
              fontSize:     '0.875rem',
              padding:      '13px 16px',
            },
            '&:last-child .MuiTableCell-body': { borderBottom: 'none' },
          },
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: {
          color:       COLORS.textSecond,
          borderTop:   `1px solid ${COLORS.border}`,
          fontSize:    '0.8rem',
        },
        selectIcon: { color: COLORS.textSecond },
        actions: {
          '& .MuiIconButton-root': {
            color: COLORS.textSecond,
            '&:hover': { color: COLORS.textPrimary, background: COLORS.accentDim },
            '&.Mui-disabled': { color: COLORS.textMuted },
          },
        },
      },
    },

    // ── Chip ──
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontSize:     '0.75rem',
          fontWeight:   600,
          height:       '26px',
        },
      },
    },

    // ── Snackbar / Alert ──
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight:   500,
        },
        standardSuccess: {
          background: 'rgba(212,245,60,0.15)',
          color:      '#3D6B00',
          border:     `1px solid rgba(212,245,60,0.4)`,
        },
        standardError: {
          background: 'rgba(255,77,109,0.08)',
          color:      COLORS.coral,
          border:     `1px solid rgba(255,77,109,0.25)`,
        },
        standardInfo: {
          background: 'rgba(41,121,255,0.08)',
          color:      COLORS.blue,
          border:     `1px solid rgba(41,121,255,0.25)`,
        },
      },
    },

    // ── Skeleton ──
    MuiSkeleton: {
      styleOverrides: {
        root: {
          background: '#EEEEEE',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, #F5F5F5, transparent)',
          },
        },
      },
    },

    // ── Tooltip ──
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background:   COLORS.bgDark,
          color:        '#FFFFFF',
          borderRadius: '8px',
          fontSize:     '0.75rem',
          boxShadow:    '0 8px 24px rgba(0,0,0,0.15)',
        },
      },
    },

    // ── Divider ──
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: COLORS.border },
      },
    },
  },
});

export { theme, COLORS };

export default theme;