#!/bin/bash
node main consumer&
for i in {1..16}; do node main producer& done
