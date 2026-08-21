import assert from 'node:assert/strict';
import { calculateVehicleMath, parseTireSize } from '../src/lib/vehicleMath.js';

function close(actual, expected, tolerance = 0.01) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
}

const metric = parseTireSize('LT245/45R18');
assert.equal(metric.format, 'metric');
close(metric.diameter, 26.6811);

const flotation = parseTireSize('35x12.50R17');
assert.equal(flotation.format, 'flotation');
close(flotation.diameter, 35);
close(flotation.sidewall, 9);
assert.equal(parseTireSize('bad tire'), null);

const result = calculateVehicleMath({
  crankHp: 400,
  crankTorque: 450,
  weight: 5_200,
  drivetrainLoss: 20,
  currentTire: '33x12.50R17',
  newTire: '35x12.50R17',
  indicatedSpeed: 60,
  topGear: 0.75,
  finalDrive: 4.10,
  firstGear: 2.84,
  transferLow: 2.72,
});

close(result.wheelHp, 320);
close(result.trueSpeed, 63.636, 0.001);
close(result.effectiveFinalDrive, 3.8657, 0.001);
close(result.recommendedFinalDrive, 4.3485, 0.001);
close(result.rpmAtIndicatedSpeed, 1878.545, 0.01);
close(result.rpmAtTrueSpeed, 1771.2, 0.01);
close(result.crawlRatio, 31.67168, 0.0001);
close(result.tireAdjustedCrawlRatio, 29.86187, 0.001);
assert.ok(result.quarterMileEt > 14 && result.quarterMileEt < 15);
assert.ok(result.quarterMileTrap > 90 && result.quarterMileTrap < 100);

console.log('vehicle math verified: metric + flotation tires, speed, RPM, gearing, crawl ratio, and performance estimates');
