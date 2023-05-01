import allowedOrigns from './allowedOrigns';

const corsOptions = {
  origin: (origin: string, callback: (error: Error | null, success: boolean) => void) => {
    if (allowedOrigns.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not Allowed By Cors'), false);
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
