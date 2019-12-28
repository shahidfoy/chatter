import * as moment from 'moment';

/**
 * uses moment to customize time output
 * @param time time stamp
 */
export const timeFromNow = (time: Date) => {
  return moment(time).fromNow();
};
