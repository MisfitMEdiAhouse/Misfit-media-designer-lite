const INCHES_PER_MILE = 63_360;
const RPM_CONSTANT = 336;

function finitePositive(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function parseTireSize(value) {
  const input = String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/-/g, 'R');

  const metric = input.match(/^(?:LT|P)?(\d{3})\/(\d{2})(?:ZR|R)(\d{2}(?:\.\d+)?)$/);
  if (metric) {
    const widthMm = Number(metric[1]);
    const aspectRatio = Number(metric[2]);
    const wheelDiameter = Number(metric[3]);
    const sidewall = (widthMm * (aspectRatio / 100)) / 25.4;
    const diameter = wheelDiameter + (2 * sidewall);
    return {
      format: 'metric',
      normalized: `${widthMm}/${aspectRatio}R${wheelDiameter}`,
      diameter,
      width: widthMm / 25.4,
      sidewall,
      wheelDiameter,
      circumference: Math.PI * diameter,
      revolutionsPerMile: INCHES_PER_MILE / (Math.PI * diameter),
    };
  }

  const flotation = input.match(/^(\d{2}(?:\.\d+)?)X(\d{1,2}(?:\.\d+)?)(?:R)?(\d{2}(?:\.\d+)?)$/);
  if (flotation) {
    const diameter = Number(flotation[1]);
    const width = Number(flotation[2]);
    const wheelDiameter = Number(flotation[3]);
    if (diameter <= wheelDiameter) return null;
    return {
      format: 'flotation',
      normalized: `${diameter}x${width}R${wheelDiameter}`,
      diameter,
      width,
      sidewall: (diameter - wheelDiameter) / 2,
      wheelDiameter,
      circumference: Math.PI * diameter,
      revolutionsPerMile: INCHES_PER_MILE / (Math.PI * diameter),
    };
  }

  return null;
}

export function calculateVehicleMath({
  crankHp,
  crankTorque,
  weight,
  drivetrainLoss,
  currentTire,
  newTire,
  indicatedSpeed,
  topGear,
  finalDrive,
  firstGear,
  transferLow,
}) {
  const hp = finitePositive(crankHp);
  const torque = finitePositive(crankTorque);
  const pounds = finitePositive(weight);
  const loss = Number(drivetrainLoss);
  const lossPct = Number.isFinite(loss) ? Math.min(50, Math.max(0, loss)) : 0;
  const current = parseTireSize(currentTire);
  const next = parseTireSize(newTire);
  const speed = finitePositive(indicatedSpeed);
  const highGear = finitePositive(topGear);
  const axle = finitePositive(finalDrive);
  const first = finitePositive(firstGear);
  const lowRange = finitePositive(transferLow);

  const wheelHp = hp ? hp * (1 - lossPct / 100) : null;
  const wheelTorque = torque ? torque * (1 - lossPct / 100) : null;
  const weightPerWheelHp = pounds && wheelHp ? pounds / wheelHp : null;
  const quarterMileEt = pounds && wheelHp ? 5.825 * Math.cbrt(pounds / wheelHp) : null;
  const quarterMileTrap = pounds && wheelHp ? 234 * Math.cbrt(wheelHp / pounds) : null;

  const tireRatio = current && next ? next.diameter / current.diameter : null;
  const diameterChangePct = tireRatio ? (tireRatio - 1) * 100 : null;
  const trueSpeed = speed && tireRatio ? speed * tireRatio : null;
  const speedometerError = trueSpeed && speed ? trueSpeed - speed : null;
  const effectiveFinalDrive = axle && tireRatio ? axle / tireRatio : null;
  const recommendedFinalDrive = axle && tireRatio ? axle * tireRatio : null;

  // A transmission/output-shaft-driven speedometer still reads from the original
  // calibration. At that indicated speed, RPM is based on the original tire size.
  const rpmAtIndicatedSpeed = speed && highGear && axle && current
    ? (speed * highGear * axle * RPM_CONSTANT) / current.diameter
    : null;

  // This treats the entered number as a desired GPS/true road speed on the new tire.
  const rpmAtTrueSpeed = speed && highGear && axle && next
    ? (speed * highGear * axle * RPM_CONSTANT) / next.diameter
    : null;

  const crawlRatio = first && axle && lowRange ? first * axle * lowRange : null;
  const tireAdjustedCrawlRatio = crawlRatio && tireRatio ? crawlRatio / tireRatio : null;

  return {
    wheelHp,
    wheelTorque,
    weightPerWheelHp,
    quarterMileEt,
    quarterMileTrap,
    currentTire: current,
    newTire: next,
    tireRatio,
    diameterChangePct,
    trueSpeed,
    speedometerError,
    effectiveFinalDrive,
    recommendedFinalDrive,
    rpmAtIndicatedSpeed,
    rpmAtTrueSpeed,
    crawlRatio,
    tireAdjustedCrawlRatio,
  };
}
