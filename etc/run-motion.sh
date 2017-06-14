#!/bin/bash

echo "Running depmod..."
/sbin/depmod

echo "Running modprobe..."
/sbin/modprobe bcm2835-v4l2

echo "Ensure we have /data/log and /data/motion for persistence"
/bin/mkdir -p /data/log
/bin/mkdir -p /data/motion

echo "Running motion..."
/usr/bin/motion -n -c /etc/motion.conf
