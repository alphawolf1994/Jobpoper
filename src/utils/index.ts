import Colors from "./colors";
import { CurrencySign } from "./constants";
import { heightToDp, widthToDp } from "./responsive";
import { formatDateDDMMYYYY } from "./dateUtils";
import { isFreshLocalVerificationUri } from "./verificationImageUri";
import { getJobCategoryName } from "./jobCategory";
import {
  getJobSeekerDisplayName,
  getJobSeekerInitials,
  isJobPostedOnBehalf,
} from "./jobSeeker";
import {
  FORCE_CLOSE_WAIT_MS,
  formatRemainingWait,
  getForceCloseAvailability,
} from "./forceCloseAvailability";

export {
  Colors,
  CurrencySign,
  heightToDp,
  widthToDp,
  formatDateDDMMYYYY,
  isFreshLocalVerificationUri,
  getJobCategoryName,
  getJobSeekerDisplayName,
  getJobSeekerInitials,
  isJobPostedOnBehalf,
  FORCE_CLOSE_WAIT_MS,
  formatRemainingWait,
  getForceCloseAvailability,
};
