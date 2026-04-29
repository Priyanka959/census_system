import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CakeRoundedIcon from '@mui/icons-material/CakeRounded';
import WcRoundedIcon from '@mui/icons-material/WcRounded';
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded';

const COLORS = {
  bgInput: '#F5F5F5',
  accent: '#D4F53C',
  accentDim: 'rgba(212,245,60,0.15)',
  dark: '#1A1A1A',
  textPrimary: '#111111',
  textSecond: '#555555',
  textMuted: '#999999',
  border: '#E2E4DF',
  coral: '#FF4D6D',
};

const FieldLabel = ({ icon: Icon, label, required }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
    <Icon sx={{ fontSize: 16, color: COLORS.textMuted }} />
    <Typography
      sx={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: COLORS.textSecond,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {label}
      {required && <span style={{ color: COLORS.coral, marginLeft: 2 }}>*</span>}
    </Typography>
  </Box>
);

const CensusForm = ({ onSubmit, onCancel, isLoading, serverError, onDirtyChange, initialData }) => {
  const maxDate = new Date().toISOString().split('T')[0];
  const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100))
    .toISOString()
    .split('T')[0];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: initialData || {
      name: '',
      gender: '',
      birthdate: '',
      is_vaccinated: '',
    },
  });

  // Notify parent of dirty state for confirmation dialog
  React.useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleFormSubmit = (data) => {
    // Convert string 'true'/'false' back to boolean for the API
    const payload = {
      ...data,
      is_vaccinated: data.is_vaccinated === 'true',
    };
    onSubmit(payload, reset);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      background: COLORS.bgInput,
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontFamily: '"DM Sans", sans-serif',
      '& fieldset': { borderColor: 'transparent' },
      '&:hover fieldset': { borderColor: COLORS.border },
      '&.Mui-focused fieldset': {
        borderColor: COLORS.accent,
        boxShadow: `0 0 0 3px ${COLORS.accentDim}`,
      },
      '&.Mui-error fieldset': {
        borderColor: COLORS.coral,
      },
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ py: 1 }}>
      {serverError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {serverError}
        </Alert>
      )}

      {/* Full Name */}
      <Box sx={{ mb: 3 }}>
        <FieldLabel icon={PersonRoundedIcon} label="Full Name" required />
        <TextField
          placeholder="Enter full name"
          {...register('name', {
            required: 'Name is required',
            maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
            validate: (value) => value.trim().length > 0 || 'Name cannot be empty',
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
          size="small"
          sx={inputSx}
        />
      </Box>

      {/* Gender + Date of Birth — side by side */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        {/* Gender */}
        <Box sx={{ flex: 1 }}>
          <FieldLabel icon={WcRoundedIcon} label="Gender" required />
          <FormControl fullWidth error={!!errors.gender} size="small">
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  displayEmpty
                  sx={{
                    background: COLORS.bgInput,
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontFamily: '"DM Sans", sans-serif',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: COLORS.border },
                    '&.Mui-focused fieldset': {
                      borderColor: COLORS.accent,
                      boxShadow: `0 0 0 3px ${COLORS.accentDim}`,
                    },
                    '&.Mui-error fieldset': {
                      borderColor: COLORS.coral,
                    },
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: COLORS.textMuted }}>Select gender</span>;
                    }
                    return selected.charAt(0).toUpperCase() + selected.slice(1);
                  }}
                >
                  <MenuItem value="male">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{ width: 8, height: 8, borderRadius: '50%', background: '#2979FF' }}
                      />
                      Male
                    </Box>
                  </MenuItem>
                  <MenuItem value="female">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{ width: 8, height: 8, borderRadius: '50%', background: '#FF4D6D' }}
                      />
                      Female
                    </Box>
                  </MenuItem>
                  <MenuItem value="other">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{ width: 8, height: 8, borderRadius: '50%', background: '#FFB800' }}
                      />
                      Other
                    </Box>
                  </MenuItem>
                </Select>
              )}
            />
            {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
          </FormControl>
        </Box>

        {/* Date of Birth */}
        <Box sx={{ flex: 1 }}>
          <FieldLabel icon={CakeRoundedIcon} label="Date of Birth" required />
          <TextField
            type="date"
            placeholder="Select date"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: maxDate,
              min: minDate,
            }}
            {...register('birthdate', {
              required: 'Date of birth is required',
              max: { value: maxDate, message: 'Cannot be a future date' },
              min: { value: minDate, message: 'Cannot be more than 100 years ago' },
            })}
            error={!!errors.birthdate}
            helperText={errors.birthdate?.message}
            fullWidth
            size="small"
            sx={{
              ...inputSx,
              '& input[type="date"]': {
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.85rem',
                color: COLORS.textPrimary,
              },
              '& input[type="date"]::-webkit-datetime-edit-text': {
                color: COLORS.textMuted,
              },
              '& input[type="date"]::-webkit-calendar-picker-indicator': {
                opacity: 0.5,
                cursor: 'pointer',
                '&:hover': { opacity: 1 },
              },
            }}
          />
        </Box>
      </Box>

      {/* Vaccination Status */}
      <Box sx={{ mb: 3 }}>
        <FieldLabel icon={VaccinesRoundedIcon} label="Vaccination Status" required />
        <FormControl error={!!errors.is_vaccinated}>
          <Controller
            name="is_vaccinated"
            control={control}
            rules={{ required: 'Vaccination status is required' }}
            render={({ field }) => (
              <RadioGroup row {...field} sx={{ gap: 1 }}>
                <FormControlLabel
                  value="true"
                  control={
                    <Radio
                      sx={{
                        color: COLORS.textMuted,
                        '&.Mui-checked': { color: COLORS.dark },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif' }}>
                      Yes, vaccinated
                    </Typography>
                  }
                  sx={{
                    border: `1px solid ${field.value === 'true' ? COLORS.accent : COLORS.border}`,
                    borderRadius: '12px',
                    px: 2,
                    py: 0.5,
                    m: 0,
                    background: field.value === 'true' ? COLORS.accentDim : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: COLORS.accent,
                      background: COLORS.accentDim,
                    },
                  }}
                />
                <FormControlLabel
                  value="false"
                  control={
                    <Radio
                      sx={{
                        color: COLORS.textMuted,
                        '&.Mui-checked': { color: COLORS.dark },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.9rem', fontFamily: '"DM Sans", sans-serif' }}>
                      No, not vaccinated
                    </Typography>
                  }
                  sx={{
                    border: `1px solid ${field.value === 'false' ? COLORS.border : COLORS.border}`,
                    borderRadius: '12px',
                    px: 2,
                    py: 0.5,
                    m: 0,
                    background: field.value === 'false' ? '#F5F5F5' : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: COLORS.textMuted,
                      background: '#F5F5F5',
                    },
                  }}
                />
              </RadioGroup>
            )}
          />
          {errors.is_vaccinated && <FormHelperText>{errors.is_vaccinated.message}</FormHelperText>}
        </FormControl>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={onCancel}
          disabled={isLoading}
          sx={{
            color: COLORS.textSecond,
            borderRadius: '50px',
            px: 3,
            '&:hover': { background: '#F5F5F5' },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : null}
          sx={{
            background: COLORS.dark,
            color: '#FFFFFF',
            borderRadius: '50px',
            px: 4,
            fontWeight: 600,
            '&:hover': {
              background: COLORS.accent,
              color: COLORS.textPrimary,
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
            },
            '&:active': { transform: 'translateY(0)' },
          }}
        >
          {isLoading ? 'Saving...' : 'Save Entry'}
        </Button>
      </Box>
    </Box>
  );
};

export default CensusForm;
