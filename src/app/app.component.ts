import { Component, AfterViewInit, OnInit } from '@angular/core';
import { timer, fromEvent } from 'rxjs';
import { map, buffer, filter, bufferTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor() {
	}

	startButton: boolean = false;
	stopButton: boolean = false;

	sec: number = 0;
	min: number = 0;
	hour: number = 0;


	ngOnInit() {
	}

	ngAfterViewInit() {
		fromEvent(document.querySelector('#stop'), 'click')
		.subscribe(() => {
			console.log('hi stop');
			this.stop();
		});
	fromEvent(document.querySelector('#start'), 'click')
		.subscribe(() => {
			console.log('hi start');
			this.start();
		});


	let wait = fromEvent(document.querySelector('#wait'), 'click')
	wait.pipe(bufferTime(300),
			map(function(list) { return list.length; }),
			filter(function(x) { return x == 2; }))
		.subscribe((x) => {
			if(x == 2) {
				// просто доп условие)
				console.log('hi wait (0.3s)');
				console.log(x);
				this.wait();
			}
		});
	fromEvent(document.querySelector('#reset'), 'click')
		.subscribe(() => {
			console.log('hi reset');
			this.reset();
		});
	}

	mytimer;

	ittimer = {
		hour: this.hour,
		min: this.min,
		sec: this.sec
	};

	start() {
		this.stopButton = false;
		this.startButton = true;
		
		console.log(typeof (this.ittimer.hour));
		console.log(this.ittimer.hour + ':' + this.ittimer.min + ':' + this.ittimer.sec);



		this.mytimer = timer(1000, 1000)
			.pipe(map(() => ++this.ittimer.sec))
			.subscribe((i) => {
				this.ittimer.sec = i;
				if (this.ittimer.sec === 60) {
					this.ittimer.sec = 0;
					this.ittimer.min++;
				}
				if (this.ittimer.min === 60) {
					this.ittimer.min = 0;
					this.ittimer.hour++;
				}
				if(this.ittimer.hour == 24 && this.ittimer.min == 0 && this.ittimer.sec == 0) {
					this.ittimer.hour = 0;
					this.ittimer.min = 0;
					this.ittimer.sec = 0;
					this.stopButton = true;
					this.startButton = false;
					return this.mytimer.unsubscribe();
				}
				console.log(this.ittimer);
			});


	}

	stop() {
		this.stopButton = true;
		this.startButton = false;
		return this.mytimer.unsubscribe();

	}

	wait() {
		this.startButton = false;
		return this.mytimer.unsubscribe();
	}

	reset() {
		this.stopButton = true;
		this.startButton = false;
		if (this.ittimer.hour != 0) {
			this.ittimer.hour = 0;
		}
		if (this.ittimer.min != 0) {
			this.ittimer.min = 0;
		}
		if (this.ittimer.sec != 0) {
			this.ittimer.sec = 0;
		}
		this.mytimer.unsubscribe();
	}
}
