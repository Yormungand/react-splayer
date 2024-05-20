// import splayer.css
import './splayer.css'
import React from "react";
import PropTypes from "prop-types";


class ReactSplayer extends React.Component {

    controlsShown = false;
    controlsTimeout = null;
    settingsShown = false;
    overrideTimeout = false;
    episodes;

    playing = false;
    currentTime = 0;
    duration = null;
    play;
    speeds = [
        {label: "0.25", value: 0.25},
        {label: "0.5", value: 0.5},
        {label: "0.75", value: 0.75},
        {label: "Normal", value: 1},
        {label: "1.25", value: 1.25},
        {label: "1.5", value: 1.5},
        {label: "1.75", value: 1.75},
        {label: "2", value: 2}
    ];
    currentSpeed = this.speeds[3];
    // currentQuality;

    constructor(props) {
        super(props);
        this.wrapper = React.createRef();
        this.video = React.createRef();
        this.controls = React.createRef();
        this.seekbar = React.createRef();
        this.thumb = React.createRef();
        this.playingProgress = React.createRef();
        this.bufferedProgress = React.createRef();
        this.seekbarTimeTooltip = React.createRef();
        this.playPauseButton = React.createRef();
        this.forwardButton = React.createRef();
        this.rewindButton = React.createRef();
        this.volumeButton = React.createRef();
        this.timeIndicator = React.createRef();
        this.title = React.createRef();
        this.settingsButton = React.createRef();
        this.fullscreenButton = React.createRef();

        this.durationEl = React.createRef();
        this.currentTimeEl = React.createRef();
        this.spinnerEl = React.createRef();
        this.rewinded = React.createRef();
        this.forwarded = React.createRef();
        this.volumeIndicator = React.createRef();
        this.playIndicator = React.createRef();

        this.settings = React.createRef();
        this.settingsBody = React.createRef();
        this.settings_mainSection = React.createRef();
        this.settings_speedSection = React.createRef();
        this.settings_qualitySection = React.createRef();

        this.backButton = React.createRef();

        const storedVolume = localStorage.getItem("splayer-volume");

        this.state = {
            volume: storedVolume ? parseFloat(storedVolume) : 1,
            canplay: false,
            currentQuality: props.sources[0],
        }

        /* #### Video events ####*/
        this.onLoadedMetaData = this.onLoadedMetaData.bind(this);
        this.onDurationChange = this.onDurationChange.bind(this);
        this.onSuspend = this.onSuspend.bind(this);
        this.onStalled = this.onStalled.bind(this);
        this.onError = this.onError.bind(this);
        this.mouseMoveOnVideo = this.mouseMoveOnVideo.bind(this);
        this.onClickOnVideo = this.onClickOnVideo.bind(this);
        this.onVideoCanPlay = this.onVideoCanPlay.bind(this);
        this.onVideoCanPlayThrough = this.onVideoCanPlayThrough.bind(this);
        this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
        this.onVideoProgress = this.onVideoProgress.bind(this);
        this.onVideoPlay = this.onVideoPlay.bind(this);
        this.onVideoPause = this.onVideoPause.bind(this);
        this.onVideoWaiting = this.onVideoWaiting.bind(this);
        this.onVideoLoadStart = this.onVideoLoadStart.bind(this);
        this.onVideoPlaying = this.onVideoPlaying.bind(this);
        this.onVolumechange = this.onVolumechange.bind(this);

        this.shortcutEvents = this.shortcutEvents.bind(this);

        this.onClickSectionHeader = this.onClickSectionHeader.bind(this);

        /* #### Control events ####*/
        this.mouseEntersControls = this.mouseEntersControls.bind(this);
        this.mouseLeavesControls = this.mouseLeavesControls.bind(this);
        this.clickOnPlayPause = this.clickOnPlayPause.bind(this);
        this.clickOnRewindButton = this.clickOnRewindButton.bind(this);
        this.clickOnForwardButton = this.clickOnForwardButton.bind(this);
        this.clickOnFullscreenButton = this.clickOnFullscreenButton.bind(this);
        this.onClickOnVolumeButton = this.onClickOnVolumeButton.bind(this);
        this.onClickCogButton = this.onClickCogButton.bind(this);
        this.onClickOutsideSettings = this.onClickOutsideSettings.bind(this);

        /* #### Seekbar events ####*/
        this.fullscreenChange = this.fullscreenChange.bind(this);
        this.onMouseEnterSeekbar = this.onMouseEnterSeekbar.bind(this);
        this.onMouseDownSeekbar = this.onMouseDownSeekbar.bind(this);
        this.onMouseMoveSeekbar = this.onMouseMoveSeekbar.bind(this);
        this.onMouseLeaveSeekbar = this.onMouseLeaveSeekbar.bind(this);
        this.handleDragThumb = this.handleDragThumb.bind(this);
        this.handleSeekbarRelease = this.handleSeekbarRelease.bind(this);
        this.onClickOnEpisodes = this.onClickOnEpisodes.bind(this);
    }

    componentDidMount() {
        // console.clear();
        console.log(this.props)
        this._videoEvents();
        this._controlsEvents();
        this._shortcutEvents();
        this._seekbarEvents();
        this._settingsInitStyles();
        this._settingsEvents();
        this.video.current.volume = this.state.volume;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentWillUnmount() {
        this._unmountVideoEvents();
        this._unmountControlsEvents();
        this._unmountSettingsEvents();
        this._unmountShortcutEvents();
        this._unmountSeekbarEvents();
    }


    /**
     * for Methods
     * ######################################################################################################
     */
    forwardRewind(dir) {
        const _this = this;
        if (!_this.state.canplay || !_this.video.current) {
            return false;
        }
        if (dir && typeof dir === "string") {
            if (dir === "forward") {
                _this.video.current.currentTime += 10;
                _this.forwarded.current.style.opacity = 1;
                setTimeout(() => {
                    _this.forwarded.current.style.opacity = 0;
                }, 300)
            } else if (dir === "rewind") {
                _this.video.current.currentTime -= 10;
                _this.rewinded.current.style.opacity = 1;
                setTimeout(() => {
                    _this.rewinded.current.style.opacity = 0;
                }, 300)
            }
        }
    }

    volumeIncrease() {
        const _this = this;
        if (_this.video.current && _this.video.current.muted)
            _this.video.current.muted = false;
        _this.video.current.volume = Math.min(1, _this.video.current.volume + .1);
        _this.setState({volume: Math.min(1, _this.video.current.volume + .1)});
        // _this.volume = Math.min(1, _this.video.current.volume + .1);
    }

    volumeDecrease() {
        const _this = this;
        if (_this.video.current && _this.video.current.muted)
            _this.video.current.muted = false;
        _this.video.current.volume = Math.max(0, _this.video.current.volume - .1);
        _this.setState({volume: Math.max(0, _this.video.current.volume - .1)});
        // _this.volume = Math.max(0, _this.video.current.volume - .1);
    }

    toggleVolume() {
        const _this = this;
        if (_this.video.current) {
            _this.video.current.muted = !_this.video.current.muted;
        }
    }

    toggleFullscreen() {
        const _this = this;
        if (!_this._checkFullscreen()) {
            _this.enterFullScreen();
        } else {
            _this.exitFullscreen();
        }
    }

    enterFullScreen() {
        const _this = this;
        if (!_this._checkFullscreen()) {
            if (_this._getPlatformType() === "iPhone") {
                _this.video.current.setAttribute("playsinline", "false");
                setTimeout(() => {
                    _this._pauseVideo();
                    _this._playVideo();
                }, 30);
            } else {
                if (_this.wrapper.current && _this.wrapper.current.requestFullscreen) {
                    _this.wrapper.current.requestFullscreen();
                } else if (_this.wrapper.current && _this.wrapper.current.webkitEnterFullscreen) {
                    _this.wrapper.current.webkitEnterFullscreen()
                } else if (_this.wrapper.current && _this.wrapper.current.mozRequestFullscreen) {
                    _this.wrapper.current.mozRequestFullscreen();
                } else if (_this.wrapper.current && _this.wrapper.current.msRequestFullscreen) {

                    _this.wrapper.current.msRequestFullscreen();
                } else {
                    console.warn("Your browser doesn't support fullscreen!");
                }
            }
        }
    }

    exitFullscreen() {
        const _this = this;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    _getPlatformType() {
        const agent = navigator.userAgent;
        if (agent.includes("Mobile")) {
            if (agent.includes("iPhone")) {
                return "iOS";
            } else {
                return "Mobile"
            }
        } else {
            if (agent.includes("Macintosh")) {
                return "Macintosh";
            } else {
                return "PC";
            }
        }
    }

    _showControls() {
        if (this.controls.current.classList.contains("hidden")) {
            this.controls.current.classList.remove("hidden");
            this.controlsShown = true;
            if (this.backButton.current)
                this.backButton.current.style.opacity = 1;
        }
    }

    _hideControls() {
        if (!this.controls.current?.classList.contains("hidden")) {
            if (!this.overrideTimeout) {
                this.controls.current?.classList.add("hidden");
                this.controlsShown = false;
                if (this.backButton.current)
                    this.backButton.current.style.opacity = 0;
            }
        }
    }

    _startControlsTimeout() {
        if (!this.overrideTimeout) {
            this.controlsTimeout = setTimeout(() => {
                this._hideControls();
                this._clearControlsTimeout();
            }, 1000)
        }
    }

    _overrideControlsTimeout() {
        this.overrideTimeout = true;
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
        }
        this._showControls();
    }

    _revokeOverrideControlsTimeout() {
        this.overrideTimeout = false;
        this._startControlsTimeout();
    }

    _clearControlsTimeout() {
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
        }
    }

    _playVideo() {
        if (this.video.current) {
            this.play = this.video.current.play();
        }
    }

    _pauseVideo() {
        if (this.play !== undefined) {
            this.play.then(_ => {
                this.video.current.pause()
            })
                .catch(error => {
                    console.warn(error);
                })
        }
    }

    _formatTime(time) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        return hours ?
            `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
            :
            `${formattedMinutes}:${formattedSeconds}`;
    }

    _changeSeekbarProgress() {
        const seekbarRect = this.seekbar.current.getBoundingClientRect();
        const progressPos = this.video.current.currentTime / this.video.current.duration;
        const newLeft = progressPos * seekbarRect.width;
        this.thumb.current.style.left = `${newLeft}px`;
        this.playingProgress.current.style.width = `${newLeft + 5}px`;
    }

    _changeBufferedProgress() {
        const _this = this;
        const seekbarRect = _this.seekbar.current.getBoundingClientRect();
        if (_this.video.current.buffered.length > 0) {
            const start = _this.video.current.buffered.start(0);
            const end = _this.video.current.buffered.end(0);
            const bufferedWidth = (end - start) / _this.video.current.duration * seekbarRect.width;
            _this.bufferedProgress.current.style.width = `${bufferedWidth}px`;
        }
    }

    _checkFullscreen() {
        return document.fullscreenElement || document.mozFullScreen || document.webkitFullScreen;
    }


    // settings methods
    _settingsInitStyles() {
        const controlsRect = this.controls.current.getBoundingClientRect();
        const settings = this.settings.current;
        const body = this.settingsBody.current;
        const bodyRect = body.getBoundingClientRect();
        const main = this.settings_mainSection.current;
        const mainRect = main.getBoundingClientRect();
        const quality = this.settings_qualitySection.current;
        const speed = this.settings_speedSection.current;

        settings.style.bottom = `${controlsRect.height}px`
        body.style.width = `${mainRect.width}px`
        body.style.height = `${mainRect.height}px`
        quality.style.right = `${mainRect.width}px`
        speed.style.right = `${mainRect.width}px`
    }

    _showSettings() {
        const settingsButton = this.settingsButton.current;
        const settings = this.settings.current;
        this.settingsShown = true;
        settingsButton.style.transform = "rotate(50deg)";
        settings.style.opacity = "1";
        settings.style.pointerEvents = "all";
        this._overrideControlsTimeout();
    }

    _hideSettings() {
        const settingsButton = this.settingsButton.current;
        const settings = this.settings.current;
        this.settingsShown = false;
        settingsButton.style.transform = "rotate(0deg)";
        settings.style.opacity = "0";
        settings.style.pointerEvents = "none";
        this._resetSettingsSection();
        this._revokeOverrideControlsTimeout();
    }

    _handleClickOnSpeedItem(speed) {
        const spd = document.querySelector(".spd-label");
        this.video.current.playbackRate = speed.value;
        spd.innerText = speed.label;
        this._resetSettingsSection();
    }

    _handleClickOnQualityItem(quality) {
        this.setState({currentQuality: quality})
        this.video.current.load();
        this.video.current.currentTime = this.currentTime;
        this._playVideo();
        this._resetSettingsSection();
    }

    _changeSettingsSection(section) {
        const main = this.settings_mainSection.current
        const body = this.settingsBody.current
        if (section) {
            main.style.right = `-${section.getBoundingClientRect().width * 2}px`
            section.style.right = "0";
            body.style.width = `${section.getBoundingClientRect().width}px`
            body.style.height = `${section.getBoundingClientRect().height}px`
        }
    }

    _resetSettingsSection() {
        const body = this.settingsBody.current
        const sections = document.querySelectorAll(".splayer_settings-section");
        const mainSection = document.getElementById("main-section");
        const mainRect = document.getElementById("main-section").getBoundingClientRect();
        for (const section of sections) {
            body.style.width = `${mainRect.width}px`;
            body.style.height = `${mainRect.height}px`;
            if (section !== mainSection)
                section.style.right = `${mainRect.width}px`;
            else
                mainSection.style.right = "0";
        }
    }

    /**
     * end of Methods
     * ######################################################################################################
     */


    /**
     * ######################################################################################################
     * for Events
     */
    _controlsEvents() {
        const _this = this;
        _this.controls.current.addEventListener("mouseenter", _this.mouseEntersControls, false);
        _this.controls.current.addEventListener("mouseleave", _this.mouseLeavesControls, false);
        _this.playPauseButton.current.addEventListener("mouseup", _this.clickOnPlayPause, false);
        _this.forwardButton.current.addEventListener("mouseup", _this.clickOnForwardButton, false);
        _this.rewindButton.current.addEventListener("mouseup", _this.clickOnRewindButton, false);
        _this.fullscreenButton.current.addEventListener("mouseup", _this.clickOnFullscreenButton, false);
        _this.volumeButton.current.addEventListener("mouseup", _this.onClickOnVolumeButton, false);
        _this.settingsButton.current.addEventListener("mouseup", _this.onClickCogButton, false);
    }

    _unmountControlsEvents() {
        const _this = this;
        _this.controls.current.removeEventListener("mouseenter", _this.mouseEntersControls, false);
        _this.controls.current.removeEventListener("mouseleave", _this.mouseLeavesControls, false);
        _this.playPauseButton.current.removeEventListener("mouseup", _this.clickOnPlayPause, false);
        _this.forwardButton.current.removeEventListener("mouseup", _this.clickOnForwardButton, false);
        _this.rewindButton.current.removeEventListener("mouseup", _this.clickOnRewindButton, false);
        _this.fullscreenButton.current.removeEventListener("mouseup", _this.clickOnFullscreenButton, false);
        _this.volumeButton.current.removeEventListener("mouseup", _this.onClickOnVolumeButton, false);
        _this.settingsButton.current.removeEventListener("mouseup", _this.onClickCogButton, false);
    }

    _seekbarEvents() {
        const _this = this;
        const seekbar = _this.seekbar.current;
        seekbar.addEventListener("mouseenter", _this.onMouseEnterSeekbar, false);
        seekbar.addEventListener("mousemove", _this.onMouseMoveSeekbar, false);
        seekbar.addEventListener("mousedown", _this.onMouseDownSeekbar, false);
        seekbar.addEventListener("mouseleave", _this.onMouseLeaveSeekbar, false);
        document.addEventListener("fullscreenchange", _this.fullscreenChange, false);
    }
    _unmountSeekbarEvents() {
        const _this = this;
        const seekbar = _this.seekbar.current;
        seekbar.removeEventListener("mouseenter", _this.onMouseEnterSeekbar, false);
        seekbar.removeEventListener("mousemove", _this.onMouseMoveSeekbar, false);
        seekbar.removeEventListener("mousedown", _this.onMouseDownSeekbar, false);
        seekbar.removeEventListener("mouseleave", _this.onMouseLeaveSeekbar, false);
        document.removeEventListener("fullscreenchange", _this.fullscreenChange, false);
    }


    _videoEvents() {
        if (!this.video.current) {
            return false;
        }
        const _this = this;
        _this.video.current.addEventListener("loadedmetadata", _this.onLoadedMetaData, false);
        _this.video.current.addEventListener("durationchange", _this.onDurationChange, false);
        _this.video.current.addEventListener("mousemove", _this.mouseMoveOnVideo, false);
        _this.video.current.addEventListener("suspend", _this.onSuspend, false);
        _this.video.current.addEventListener("stalled", _this.onStalled, false);
        _this.video.current.addEventListener("error", _this.onError, false);
        _this.video.current.addEventListener("click", _this.onClickOnVideo);
        _this.video.current.addEventListener("canplay", _this.onVideoCanPlay, false);
        _this.video.current.addEventListener("canplaythrough", _this.onVideoCanPlay, false);
        _this.video.current.addEventListener("timeupdate", _this.onVideoTimeUpdate, false);
        _this.video.current.addEventListener("progress", _this.onVideoProgress, false);
        _this.video.current.addEventListener("play", _this.onVideoPlay, false);
        _this.video.current.addEventListener("pause", _this.onVideoPause, false);
        _this.video.current.addEventListener("waiting", _this.onVideoWaiting, false);
        _this.video.current.addEventListener("loadstart", _this.onVideoLoadStart, false);
        _this.video.current.addEventListener("playing", _this.onVideoPlaying, false);
        _this.video.current.addEventListener("volumechange", _this.onVolumechange, false);
    }

    _unmountVideoEvents() {
        const _this = this;
        _this.video.current.removeEventListener("loadedmetadata", _this.onLoadedMetaData, false);
        _this.video.current.removeEventListener("durationchange", _this.onDurationChange, false);
        _this.video.current.removeEventListener("mousemove", _this.mouseMoveOnVideo, false);
        _this.video.current.removeEventListener("suspend", _this.onSuspend, false);
        _this.video.current.removeEventListener("stalled", _this.onStalled, false);
        _this.video.current.removeEventListener("error", _this.onError, false);
        _this.video.current.removeEventListener("click", _this.onClickOnVideo);
        _this.video.current.removeEventListener("canplay", _this.onVideoCanPlay, false);
        _this.video.current.removeEventListener("canplaythrough", _this.onVideoCanPlayThrough, false);
        _this.video.current.removeEventListener("timeupdate", _this.onVideoTimeUpdate, false);
        _this.video.current.removeEventListener("progress", _this.onVideoProgress, false);
        _this.video.current.removeEventListener("play", _this.onVideoPlay, false);
        _this.video.current.removeEventListener("pause", _this.onVideoPause, false);
        _this.video.current.removeEventListener("waiting", _this.onVideoWaiting, false);
        _this.video.current.removeEventListener("loadstart", _this.onVideoLoadStart, false);
        _this.video.current.removeEventListener("playing", _this.onVideoPlaying, false);
        _this.video.current.removeEventListener("volumechange", _this.onVolumechange, false);
    }


    _shortcutEvents() {
        const _this = this;
        window.addEventListener("keydown", _this.shortcutEvents, false);
    }

    _unmountShortcutEvents() {
        const _this = this;
        window.removeEventListener("keydown", _this.shortcutEvents, false);
    }

    _settingsEvents() {
        const headers = document.querySelectorAll(".splayer_settings-section-header");
        for (const header of headers) {
            header.addEventListener("mouseup", this.onClickSectionHeader, false)
        }
    }
    _unmountSettingsEvents() {
        const headers = document.querySelectorAll(".splayer_settings-section-header");
        for (const header of headers) {
            header.removeEventListener("mouseup", this.onClickSectionHeader, false);
        }
    }

    /**
     * end of Events
     * ######################################################################################################
     */



    onClickOnEpisodes() {
        const { onClickEpisodes } = this.props;
        if (onClickEpisodes)
            onClickEpisodes();
    }

    render() {
        return (
            <div className="player" ref={this.wrapper}>
                {
                    typeof this.props.backNavigation === "function" &&
                    <div ref={this.backButton} className="back-button" onClick={()=> this.props.backNavigation()}/>
                }
                <video
                    ref={this.video}
                    preload="metadata"
                    controls={false}
                    width="100%"
                    height="100%"
                >
                    <source src={this.state.currentQuality?.src} type={this.state.currentQuality?.type}/>
                </video>
                <div ref={this.controls} className="controls hidden">
                    <div ref={this.seekbar} className="seekbar">
                        <div ref={this.thumb} className="thumb"/>
                        <div ref={this.playingProgress} className="playing-overlay"/>
                        <div ref={this.bufferedProgress} className="buffered-overlay"/>
                        <div ref={this.seekbarTimeTooltip} className="seekbar-time">--:--</div>
                    </div>
                    <button ref={this.playPauseButton}
                            type="button" data-state="play"
                            className="playpause-button"></button>
                    <button ref={this.rewindButton} type="button" className="rewind-button"></button>
                    <button ref={this.forwardButton} type="button" className="forward-button"></button>
                    <button ref={this.volumeButton} type="button" data-state="volume_loud"
                            className="volume-button"></button>
                    <div ref={this.timeIndicator} className="video-time">
                        <span ref={this.currentTimeEl}>--:--</span> / <span ref={this.durationEl}>--:--</span>
                    </div>
                    <div ref={this.title} className="video-title">{this.props.videoTitle}</div>
                    {
                        this.props.episodes > 1 &&
                        <button onClick={this.onClickOnEpisodes} className="episodes-button"></button>
                    }
                    <button ref={this.settingsButton} className="cog-button"></button>
                    <button ref={this.fullscreenButton} type="button" data-state="fs-enter"
                            className="fullscreen-button"></button>
                </div>
                <div ref={this.settings} className="splayer_settings">
                    <div ref={this.settingsBody} className="splayer_settings-body">
                        <div ref={this.settings_mainSection} id="main-section" className="splayer_settings-section">
                            <div className="splayer_settings-item"
                                 onClick={() => this._changeSettingsSection(this.settings_speedSection.current)}>
                                Speed
                                <div className="spd-label">{this.currentSpeed.label}</div>
                            </div>
                            <div className="splayer_settings-item"
                                 onClick={() => this._changeSettingsSection(this.settings_qualitySection.current)}>
                                Quality
                                <div className="qlt-label">{this.state.currentQuality?.label}</div>
                            </div>
                        </div>
                        <div ref={this.settings_qualitySection} id="quality-section"
                             className="splayer_settings-section">
                            <div className="splayer_settings-section-header">
                                Quality
                            </div>
                            {
                                this.props.sources &&
                                this.props.sources.map((qlty, index) => (
                                    <div
                                        key={`speed-${index}`}
                                        className="splayer_settings-item"
                                        onClick={() => this._handleClickOnQualityItem(qlty)}
                                    >
                                        {qlty.label}
                                    </div>
                                ))
                            }
                        </div>
                        <div ref={this.settings_speedSection} id="speed-section" className="splayer_settings-section">
                            <div className="splayer_settings-section-header">
                                Quality
                            </div>
                            {
                                this.speeds.map((speed, index) => (
                                    <div
                                        key={`speed-${index}`}
                                        className="splayer_settings-item"
                                        onClick={() => this._handleClickOnSpeedItem(speed)}
                                    >
                                        {speed.label}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div ref={this.spinnerEl} className="spinner"/>
                <div ref={this.playIndicator} className="indicator-elements play-button" data-state="play"/>
                <div ref={this.volumeIndicator} className="indicator-elements volume-control" data-state="volume_loud"/>
                <div ref={this.rewinded} className="indicator-elements rewinded"/>
                <div ref={this.forwarded} className="indicator-elements forwarded"/>
            </div>
        )

    }


    // ###### VIDEO EVENTS ######
    onLoadedMetaData(e) {
        const { loadedmetadata } = this.props;
        if ( loadedmetadata )
            loadedmetadata(e);
    }

    onDurationChange(e) {
        const {durationchange} = this.props;
        if (durationchange)
            durationchange(e)
    }

    onSuspend(e) {
        const {suspend} = this.props;
        if (suspend)
            suspend(e);
    }

    onStalled(e) {
        const {stalled} = this.props;
        if (stalled)
            stalled(e);
    }

    onError(e) {
        const {error} = this.props;
        if (error)
            error(e);
    }

    mouseMoveOnVideo(e) {
        if (!this.controlsShown) {
            this._showControls();
            this._startControlsTimeout();
        }
    }

    onClickOnVideo(e) {
        if (this.video.current.paused || this.video.current.ended) {
            this._playVideo();
        } else if (this.video.current.play) {
            this._pauseVideo();
        }
    }

    onVideoCanPlay(e) {
        const {canplay} = this.props;
        if (canplay)
            canplay(e);
        this.spinnerEl.current.style.opacity = 0;
        this.setState({canplay: true});
        this.durationEl.current.innerText = this._formatTime(this.video.current.duration);
        this.currentTimeEl.current.innerText = this._formatTime(0);
    }

    onVideoCanPlayThrough(e) {
        const {canplaythrough} = this.props;
        if (canplaythrough)
            canplaythrough(e);
    }

    onVideoTimeUpdate(e) {
        const {timeupdate} = this.props;
        if (timeupdate)
            timeupdate(e);
        this.currentTime = this.video.current.currentTime;
        this.currentTimeEl.current.innerText = this._formatTime(this.video.current.currentTime);
        this._changeSeekbarProgress();
    }

    onVideoProgress(e) {
        const {progress} = this.props;
        if (progress)
            progress(e);
        this._changeBufferedProgress();
    }

    onVideoPlay(e) {
        const {play} = this.props;
        if (play)
            play(e);
        this.playing = true;
        this.playPauseButton.current.setAttribute("data-state", "pause");
        this.playIndicator.current.setAttribute("data-state", "play");
        this.playIndicator.current.style.opacity = "1";
        setTimeout(() => {
            this.playIndicator.current.style.opacity = "0";
        }, 300)
    }

    onVideoPause(e) {
        const {pause} = this.props;
        if (pause)
            pause(e);
        this.playing = false;
        this.playPauseButton.current.setAttribute("data-state", "play");
        this.playIndicator.current.setAttribute("data-state", "pause");
        this.playIndicator.current.style.opacity = "1";
        setTimeout(() => {
            this.playIndicator.current.style.opacity = "0";
        }, 300)
    }

    onVideoWaiting(e) {
        const {waiting} = this.props;
        if (waiting)
            waiting(e);
        this.spinnerEl.current.style.opacity = 1;
    }

    onVideoLoadStart(e) {
        const {loadstart} = this.props;
        if (loadstart)
            loadstart(e);
        this.spinnerEl.current.style.opacity = 1;
    }

    onVideoPlaying(e) {
        const {playing} = this.props;
        if (playing)
            playing(e);
        this.spinnerEl.current.style.opacity = 0;
    }

    onVolumechange(e) {
        localStorage.setItem("splayer-volume", this.video.current.volume);
        const { volumechange } = this.props;
        if (volumechange)
            volumechange(e);
        const video = this.video.current;
        const volume = this.video.current.volume;
        const volumeButton = this.volumeButton.current;
        const volumeIndicator = this.volumeIndicator.current;
        if (volume >= .1 && volume <= .3) {
            volumeButton.setAttribute("data-state", "volume_low");
            volumeIndicator.setAttribute("data-state", "volume_low");
        }
        if (volume >= .4 && volume <= .7) {
            volumeButton.setAttribute("data-state", "volume_medium");
            volumeIndicator.setAttribute("data-state", "volume_medium");
        }
        if (volume >= .8 && volume === 1) {
            volumeButton.setAttribute("data-state", "volume_loud");
            volumeIndicator.setAttribute("data-state", "volume_loud");
        }
        if (volume === 0) {
            volumeButton.setAttribute("data-state", "volume_muted");
            volumeIndicator.setAttribute("data-state", "volume_muted");
        }
        if (video.muted) {
            volumeButton.setAttribute("data-state", "volume_muted");
            volumeIndicator.setAttribute("data-state", "volume_muted");
        }
        volumeIndicator.style.opacity = 1;
        setTimeout(() => {
            volumeIndicator.style.opacity = 0;
        }, 300)
    }

    // ###### end of video events ######

    // ###### Shortcuts ######
    shortcutEvents(e) {
        // Arrow left
        if (e.keyCode == "37")
            this.forwardRewind("rewind");
        // Arrow right
        else if (e.keyCode == "39")
            this.forwardRewind("forward");
        // Arrow up
        else if (e.keyCode == "38") {
            this.volumeIncrease();
        }
        // Arrow down
        else if (e.keyCode == "40") {
            this.volumeDecrease();
        }
        // Space key
        else if (e.keyCode == "32") {
            if (this.video.current.paused || this.video.current.ended) {
                this._playVideo();
            } else {
                this._pauseVideo();
            }
        }
        // F key
        else if (e.keyCode == "70") {
            this.toggleFullscreen();
        }
    }

    // ###### Settings ######
    onClickSectionHeader(e) {
        this._resetSettingsSection();
    }


    // ###### Controls events ######
    mouseEntersControls(e) {
        this._overrideControlsTimeout();
    }

    mouseLeavesControls() {
        if (this.settingsShown) {
            this._hideControls();
        } else {
            this._revokeOverrideControlsTimeout();
        }
    }

    clickOnPlayPause(e) {
        if (this.video.current.paused || this.video.current.ended) {
            this._playVideo();
            this.spinnerEl.current.style.opacity = 0;
        } else if (this.video.current.play) {
            this._pauseVideo();
        }
    }

    clickOnRewindButton(e) {
        this.forwardRewind("rewind");
    }

    clickOnForwardButton(e) {
        this.forwardRewind("forward");
    }

    clickOnFullscreenButton(e) {
        this.toggleFullscreen();
    }

    onClickOnVolumeButton(e) {
        this.toggleVolume();
    }

    onClickCogButton(e) {
        if (this.settingsShown) {
            this._hideSettings();
        } else {
            this._showSettings();
            document.onclick = this.onClickOutsideSettings;
        }
    }

    onClickOutsideSettings(e) {
        if (e.composedPath() && !e.composedPath().includes(this.settings.current)) {
            if (this.settingsShown && e.target !== this.settingsButton.current) {
                this._hideSettings();
                document.onclick = null
            }
        }
    }


    // ###### Seekbar events ######
    fullscreenChange(e) {
        const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        if (!state) {
            this.fullscreenButton.current.setAttribute("data-state", "fs-enter");
        } else {
            this.fullscreenButton.current.setAttribute("data-state", "fs-exit");
        }
    }

    onMouseEnterSeekbar(e) {

    }

    async onMouseDownSeekbar(e) {
        e.stopPropagation();
        e.preventDefault();
        const {currentTime, timePos, newPos} = await this.calcTimeTooltip(e);
        this.video.current.currentTime = currentTime;

        document.onmousemove = this.handleDragThumb;
        document.onmouseup = this.handleSeekbarRelease;
    }

    async onMouseMoveSeekbar(e) {
        await this.transformTimeTooltip(e);
    }

    onMouseLeaveSeekbar(e) {
        this.hideTimeTooltip(e);
    }

    async handleDragThumb(e) {
        e.preventDefault();
        e.stopPropagation();
        const {currentTime, timePos, newPos} = await this.calcTimeTooltip(e);
        this.playingProgress.current.style.width = `${newPos}px`;
        this.thumb.current.style.left = `${newPos}px`;

        this._showControls();
        this._overrideControlsTimeout();
        await this.transformTimeTooltip(e);
        this.video.current.currentTime = currentTime;
    }

    handleSeekbarRelease(e) {
        this.hideTimeTooltip(e);
        document.onmousemove = null;
        document.onmouseup = null;
    }

    // ###### Time tooltip method ######
    async transformTimeTooltip(e) {
        const {currentTime, timePos, newPos} = await this.calcTimeTooltip(e);
        this.seekbarTimeTooltip.current.style.left = `${timePos}px`;
        this.seekbarTimeTooltip.current.innerText = this._formatTime(currentTime);
        this.seekbarTimeTooltip.current.style.opacity = 1;
    }
    async calcTimeTooltip(e) {
        try {
            const seekbarRect = this.seekbar.current.getBoundingClientRect();
            const timeRect = this.seekbarTimeTooltip.current.getBoundingClientRect();
            const relativeOffsetX = e.clientX - seekbarRect.left;
            const newPos = Math.max(0, Math.min(relativeOffsetX, seekbarRect.width));
            const currentTime = await (newPos / seekbarRect.width) * this.video.current.duration;
            const timePos = await (newPos - (timeRect.width / 2));

            return {currentTime, timePos, newPos}
        } catch (e) {
            console.warn(e)
        }
    }
    hideTimeTooltip(e) {
        this.seekbarTimeTooltip.current.style.opacity = 0;
    }
}

ReactSplayer.propTypes = {
    sources: PropTypes.array.isRequired,
    videoTitle: PropTypes.string,
    episodes: PropTypes.number,
    fullscreenAuto: PropTypes.bool,
    backNavigation: PropTypes.func,
    onClickEpisodes: PropTypes.func,
    canplay: PropTypes.func,
    canplaythrough: PropTypes.func,
    durationchange: PropTypes.func,
    emptied: PropTypes.func,
    ended: PropTypes.func,
    error: PropTypes.func,
    play: PropTypes.func,
    playing: PropTypes.func,
    pause: PropTypes.func,
    loadeddata: PropTypes.func,
    loadedmetadata: PropTypes.func,
    loadstart: PropTypes.func,
    progress: PropTypes.func,
    ratechange: PropTypes.func,
    seeked: PropTypes.func,
    seeking: PropTypes.func,
    stalled: PropTypes.func,
    suspend: PropTypes.func,
    timeupdate: PropTypes.func,
    volumechange: PropTypes.func,
    waiting: PropTypes.func,
}

ReactSplayer.defaultProps = {
    videoTitle: "",
    sources: [],
    episodes: 1,
    fullscreenAuto: false,
    backNavigation: null,
    onClickOnEpisodes: () => {},
}

export default ReactSplayer;
