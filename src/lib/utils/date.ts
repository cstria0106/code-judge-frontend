import moment from 'moment';

export function isBefore(dateString: string, fromTime: moment.Moment) {
  const date = moment(dateString);
  return date.endOf('seconds').isBefore(fromTime);
}

export function isAfter(dateString: string, fromTime: moment.Moment) {
  const date = moment(dateString);
  return date.startOf('seconds').isAfter(fromTime);
}
